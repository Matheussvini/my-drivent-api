import Joi from 'joi';
import { InputBookingBody } from '@/protocols';

export const bookingsSchema = Joi.object<InputBookingBody>({
  roomId: Joi.number().required(),
});
