import { compare } from 'bcrypt';
import { prisma } from '../../DB/prismaConfig';
import { sign } from 'jsonwebtoken';
import verifyAccess from '../../Functions/verify_access';

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
  email = email.trim().toLocaleLowerCase();

  const user = await prisma.operators.findUnique({
    where: { email },
  });

  if (!user) throw new Error('Incorrect Email or Password.');

  verifyAccess(
    user.is_verified,
    user.is_terminated,
    user.login_attempt!
  );

  const isMatch = await compare(password, user.password_hash!);

  if (!isMatch) {
    // * if user failed to login multiple times then the login attept will increment
    await prisma.operators.update({
      where: { id: user.id },
      data: {
        login_attempt: { increment: 1 },
      },
    });

    throw new Error('Incorrect Email or Password');
  } else {
    // * if password was correct, then login attept will go down to 0
    await prisma.operators.update({
      where: { id: user.id },
      data: {
        login_attempt: 0,
      },
    });
  }

  return user;
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

  verifyAccess(
    user.is_verified,
    user.is_terminated,
    user.login_attempt!
  );

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
      last_active_time: new Date(),
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
  findOperatorAndReplaceRefreshToken,
};
