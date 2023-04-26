import { conflictError, forbiddenError, notFoundError, paymentRequiredError } from '@/errors';
import bookingsRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { exclude } from '@/utils/prisma-utils';

async function checkRooms(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}

async function getUserBooking(userId: number) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (!booking) throw notFoundError();

  return exclude(booking, 'userId', 'roomId', 'createdAt', 'updatedAt');
}

async function createBooking(userId: number, roomId: number) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (booking) throw conflictError(`User already has a booking with bookingId ${booking.id}`);

  await checkRooms(userId);

  const room = await bookingsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const count = await bookingsRepository.countBookingsByRoomId(roomId);
  if (count >= room.capacity) throw forbiddenError('Room is already full');

  return await bookingsRepository.createBooking(userId, roomId);
}

export default {
  getUserBooking,
  createBooking,
};
