import httpStatus from 'http-status';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken, testInvalidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeWithHotel,
  createUser,
  createHotel,
  createRoomWithHotelId,
  createBooking,
  createFunctionalRoom,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  testInvalidToken();

  describe('when token is valid', () => {
    it('should return 404 if user has no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 200 if user has a booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  testInvalidToken();

  describe('when token is valid', () => {
    it('should return 400 if roomId is not provided', async () => {
      const { token } = await createFunctionalRoom();

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({});
      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it('should return 404 if roomId is invalid', async () => {
      const { token, roomId } = await createFunctionalRoom();

      const response = await server
        .post('/booking')
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: roomId + 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 403 if room is not available', async () => {
      const { userId, roomId } = await createFunctionalRoom();
      await createBooking(userId, roomId);

      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return 409 if user has already a booking', async () => {
      const { token, userId, roomId } = await createFunctionalRoom();
      await createBooking(userId, roomId);

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('should return 200 if the booking is created', async () => {
      const { token, roomId } = await createFunctionalRoom();

      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send({ roomId });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        roomId,
      });
    });
  });
});
