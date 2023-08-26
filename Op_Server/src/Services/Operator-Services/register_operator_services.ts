import { verify } from 'jsonwebtoken';
import { prisma } from '../../DB/prismaConfig';
import { isStrongPassword } from '../../Helpers/stringValidation';
import { DecodedVerificationToken } from '../../Types/GeneralTypes';
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

  if (user.verfication_code !== code)
    throw new Error('Invalid request.');

  return user;
};

const createPassword = async (
  id: number,
  password: string,
  code: string,
  checkIsVerifies: boolean
) => {
  const user = await prisma.operators.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (!user || user?.is_terminated)
    throw new Error('Invalid request');

  if (checkIsVerifies) {
    if (user.is_verified) throw new Error('Invalid request');
  }

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

const logMeOut = async (myId: number, refreshToken: string) => {
  const me = await prisma.operators.findUnique({
    where: {
      id: myId,
    },
    select: {
      refresh_tokens: true,
    },
  });

  const filteredTokens = me?.refresh_tokens.filter(
    (token) => token != refreshToken
  );

  await prisma.operators.update({
    where: {
      id: myId,
    },
    data: {
      refresh_tokens: filteredTokens || [],
    },
  });
};

const logMeOutAllDevices = async (myId: number) => {
  await prisma.operators.update({
    where: {
      id: myId,
    },
    data: {
      refresh_tokens: [],
    },
  });
};

export {
  getAndCheckRegistrationProfile,
  createPassword,
  logMeOut,
  logMeOutAllDevices,
};
