import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingsService.getUserBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
