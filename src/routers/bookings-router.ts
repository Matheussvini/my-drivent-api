import { Router } from 'express';
import { createBooking, getUserBooking } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingsSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', validateBody(bookingsSchema), createBooking);

export { bookingsRouter };
