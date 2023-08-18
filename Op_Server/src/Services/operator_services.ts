import { compare } from 'bcrypt';
import { prisma, operators } from '../DB/prismaConfig';
import { sign } from 'jsonwebtoken';
import client from '../DB/connection';
import { Prisma, users } from '@prisma/client';
import verifyAccess from '../Middleware/verify_access';

// * get operator by id
const getOperatorById = async (id: number) => {
  const user = await prisma.operators.findUnique({
    where: { id },
  });

  return user;
};

// * get operator by email and password
const findOperatorByCredentials = async (
  email: string,
  password: string
) => {
  const user = await prisma.operators.findUnique({
    where: { email },
  });

  if (!user) throw new Error('Incorrect Email or Password.');

  const isMatch = await compare(password, user.password_hash!);
  if (!isMatch) throw new Error('Incorrect Email or Password');

  return user;
};

// * generate and add refresh token with jwt and add refresh token to db
const genarateOperatorAuthToken = async (user: operators) => {
  const token = await sign(
    {
      id: user.id.toString(),
      userRole: user.user_role,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.EXPTIME!,
    }
  );

  const refreshToken = sign(
    { id: user.id.toString(), userRole: user.user_role },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.EXPTIME!,
    }
  );

  const query = {
    where: {
      id: user.id,
    },
    data: {
      refresh_tokens: { push: refreshToken },
    },
  };

  await prisma.operators.update(query);

  return { token, refreshToken };
};

// * get operator by id
const findOperatorAndReplaceRefreshToken = async (
  id: number,
  userRole: string,
  oldRefreshToken: string
) => {
  const newRefreshToken = sign(
    { id: id.toString(), userRole },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.EXPTIME!,
    }
  );

  const user = await prisma.operators.findFirstOrThrow({
    where: {
      AND: [
        { id },
        {
          refresh_tokens: {
            has: oldRefreshToken,
          },
        },
      ],
    },
  });

  if (!user) throw new Error('Please Authenticate.');

  verifyAccess(user.is_verified, user.is_terminated);

  const refreshedUser = await prisma.operators.update({
    where: {
      id,
    },
    data: {
      refresh_tokens: {
        set: [
          ...user.refresh_tokens.filter(
            (token) => token !== oldRefreshToken
          ),
          newRefreshToken,
        ],
      },
    },
  });

  const newToken = await sign(
    {
      id: user.id.toString(),
      userRole: user.user_role,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.EXPTIME!,
    }
  );

  return { refreshedUser, newRefreshToken, newToken };
};

export {
  getOperatorById,
  findOperatorByCredentials,
  genarateOperatorAuthToken,
  findOperatorAndReplaceRefreshToken,
};
