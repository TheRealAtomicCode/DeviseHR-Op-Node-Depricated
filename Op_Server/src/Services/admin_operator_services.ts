import { prisma } from '../DB/prismaConfig';
import { UserRole } from '../Types/GeneralTypes';

const createOperator = async (
  firstName: string,
  lastName: string,
  email: string,
  role: UserRole,
  myId: number
) => {
  try {
    email = email.toLowerCase().trim();
    firstName = firstName.trim();
    lastName = lastName.trim();

    const newUser = await prisma.operators.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        user_role: role,
        added_by: myId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        user_role: true,
        created_at: true,
        updated_at: true,
        is_terminated: true,
        is_verified: true,
        added_by: true,
      },
    });

    return newUser;
  } catch {
    throw new Error('Email already exists.');
  }
};

export { createOperator };
