import { prisma } from '@/config';

async function findHotels() {
  return await prisma.hotel.findMany();
}

export default {
  findHotels,
};
