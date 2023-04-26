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

async function findRoomById(roomId: number) {
  return await prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function countBookingsByRoomId(roomId: number) {
  return await prisma.booking.count({
    where: {
      roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number) {
  return await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function replaceBooking(bookingId: number, roomId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId,
    },
  });
}

export default {
  findUserBooking,
  findRoomById,
  countBookingsByRoomId,
  createBooking,
  replaceBooking,
};
