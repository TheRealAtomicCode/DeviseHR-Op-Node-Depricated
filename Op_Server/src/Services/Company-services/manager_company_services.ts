import { prisma } from '../../DB/prismaConfig';

const updateEmailById = async (
  userId: number,
  email: string,
  myId: number
) => {
  const updatedUser = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      email,
      updated_at: new Date(),
      updated_by_operator: myId,
    },
    select: {
      id: true,
      email: true,
      updated_at: true,
      updated_by_operator: true,
    },
  });

  return updatedUser;
};

export { updateEmailById };
