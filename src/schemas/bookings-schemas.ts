import Joi from 'joi';
import { InputBookingBody, InputBookingParams } from '@/protocols';

export const bookingsBodySchema = Joi.object<InputBookingBody>({
  roomId: Joi.number().required(),
});

export const bookingsParamsSchema = Joi.object<InputBookingParams>({
  bookingId: Joi.number().required(),
});
