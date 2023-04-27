import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { generateValidToken } from '../helpers';
import { createUser } from './users-factory';
import { createEnrollmentWithAddress } from './enrollments-factory';
import { createTicket, createTicketTypeWithHotel } from './tickets-factory';
import { createPayment } from './payments-factory';
import { prisma } from '@/config';

export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.name.findName(),
      capacity: 1,
      hotelId,
    },
  });
}

export async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

export async function createFunctionalRoom() {
  const user = await createUser();
  const token = await generateValidToken(user);
  const enrollment = await createEnrollmentWithAddress(user);
  const ticketType = await createTicketTypeWithHotel();
  const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  await createPayment(ticket.id, ticketType.price);
  const hotel = await createHotel();
  const room = await createRoomWithHotelId(hotel.id);

  return { token, userId: user.id, roomId: room.id, hotelId: hotel.id };
}
