import { conflictError, forbiddenError, notFoundError, paymentRequiredError } from '@/errors';
import { InputBookingReplace } from '@/protocols';
import bookingsRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { exclude } from '@/utils/prisma-utils';

async function checkPayment(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}

async function checkRoom(roomId: number) {
  const room = await bookingsRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const count = await bookingsRepository.countBookingsByRoomId(roomId);
  if (count >= room.capacity) throw forbiddenError('Room is already full');
}

async function getUserBooking(userId: number) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (!booking) throw notFoundError();

  return exclude(booking, 'userId', 'roomId', 'createdAt', 'updatedAt');
}

async function createBooking(userId: number, roomId: number) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (booking) throw conflictError(`User already has a booking with bookingId ${booking.id}`);

  await checkPayment(userId);
  await checkRoom(roomId);

  return await bookingsRepository.createBooking(userId, roomId);
}

async function replaceBooking({ userId, bookingId, roomId }: InputBookingReplace) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (!booking) throw notFoundError();

  await checkRoom(userId);

  return await bookingsRepository.replaceBooking(bookingId, roomId);
}

export default {
  getUserBooking,
  createBooking,
  replaceBooking,
};
