import { prisma } from '@/config';

async function findUserBooking(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    include: {
      Room: true,
    },
  });
}

export default {
  findUserBooking,
};
