import { verify } from 'jsonwebtoken';
import { prisma } from '../DB/prismaConfig';
import { isStrongPassword } from '../Helpers/stringValidation';
import { DecodedVerificationToken } from '../Types/GeneralTypes';
import { hash } from 'bcrypt';

const getAndCheckRegistrationProfile = async (
  id: number,
  code: string
) => {
  const query = {
    where: {
      id,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      is_terminated: true,
      is_verified: true,
      verfication_code: true,
    },
  };
  const user = await prisma.operators.findUnique(query);

  if (!user || !user.verfication_code || user.is_terminated)
    throw new Error('Invalid Request');

  // const decode = (await verify(
  //   user.verfication_code,
  //   process.env.JWT_SECRET!
  // )) as DecodedVerificationToken;

  if (user.verfication_code !== code)
    throw new Error('Invalid request.');

  return user;
};

const createPassword = async (
  id: number,
  password: string,
  code: string
) => {
  const user = await prisma.operators.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!user || user?.is_terminated || user.is_verified)
    throw new Error('Invalid request');
  // const decode = (await verify(
  //   user?.verification_code!,
  //   process.env.JWT_SECRET!
  // )) as DecodedVerificationToken;
  if (user.verfication_code !== code)
    throw new Error('Invalid request.');

  password = password.trim();
  isStrongPassword(password);

  const hashedPassword = await hash(password, 10);

  const updateUserQuery = {
    where: {
      id,
    },
    data: {
      password_hash: hashedPassword,
      is_verified: true,
      verfication_code: null,
    },
  };

  await prisma.operators.update(updateUserQuery);

  return { success: 'password updated' };
};

export { getAndCheckRegistrationProfile, createPassword };
