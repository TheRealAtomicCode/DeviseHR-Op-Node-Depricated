import { operators } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import deleteAllRefreshTokens from './delete_add_refresh_tokens';
import { prisma } from '../DB/prismaConfig';

// * generate and add refresh token with jwt and add refresh token to db
export const genarateOperatorAuthToken = async (user: operators) => {
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

  if (user.refresh_tokens.length > 6) {
    // * id refresh tokens are above 6 then delete all previous refresh tokens
    await deleteAllRefreshTokens(user.id);
  }

  const query = {
    where: {
      id: user.id,
    },
    data: {
      refresh_tokens: { push: refreshToken },
      last_login_time: new Date(),
      last_active_time: new Date(),
    },
  };

  await prisma.operators.update(query);

  return { token, refreshToken };
};

export const genarateOperatorRegistrationToken = async (
  id: number
) => {
  const token = await sign(
    {
      id: id.toString(),
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.REG_EXPTIME!,
    }
  );

  return token;
};

export const updateVerificationToken = async (
  operatorId: number,
  verificationCode: string
) => {
  const user = await prisma.operators.update({
    where: { id: operatorId },
    data: {
      verfication_code: verificationCode,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
    },
  });

  return user;
};
