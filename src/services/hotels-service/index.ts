import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import hotelsRepository from '@/repositories/hotels-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw paymentRequiredError();
  }
}

async function getAllHotels(userId: number) {
  await checkHotels(userId);

  const hotels = await hotelsRepository.findHotels();
  if (!hotels.length) throw notFoundError();
  return hotels;
}

async function getHotelById(userId: number, hotelId: number) {
  await checkHotels(userId);

  const hotel = await hotelsRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}

export default {
  getAllHotels,
  getHotelById,
};
