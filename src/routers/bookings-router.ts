import { Router } from 'express';
import { getUserBooking } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const bookingsRouter = Router();

bookingsRouter.all('/*', authenticateToken).get('/', getUserBooking);

export { bookingsRouter };
