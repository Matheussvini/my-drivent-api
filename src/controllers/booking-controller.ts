import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/booking-service';
import { InputBookingBody, InputBookingParams } from '@/protocols';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getUserBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body as InputBookingBody;
  try {
    const booking = await bookingsService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    if (error.name === 'ConflictError') return res.sendStatus(httpStatus.CONFLICT);
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function replaceBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params as unknown as InputBookingParams;
  const { roomId } = req.body as InputBookingBody;
  try {
    const booking = await bookingsService.replaceBooking({ userId, bookingId: Number(bookingId), roomId });
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
