import { notFoundError } from '@/errors';
import bookingsRepository from '@/repositories/bookings-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { exclude } from '@/utils/prisma-utils';

async function checkRooms(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();
}

async function getUserBooking(userId: number) {
  const booking = await bookingsRepository.findUserBooking(userId);
  if (!booking) throw notFoundError();

  return exclude(booking, 'userId', 'roomId', 'createdAt', 'updatedAt');
}

export default {
  getUserBooking,
};
