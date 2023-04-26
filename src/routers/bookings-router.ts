import { Router } from 'express';
import { getUserBooking } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';
import { bookingsSchema } from '@/schemas';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', validateBody(bookingsSchema), getUserBooking);

export { bookingsRouter };
