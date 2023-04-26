import { Router } from 'express';
import { createBooking, getUserBooking } from '@/controllers';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { bookingsBodySchema, bookingsParamsSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', validateBody(bookingsBodySchema), createBooking)
  .put('/:bookingId', validateParams(bookingsParamsSchema), validateBody(bookingsBodySchema), createBooking);

export { bookingsRouter };
