import { prisma } from '../../DB/prismaConfig';
import {
  generateVerificationCode,
  sendOperatorForgetPassword,
  sendOperatorRagistration,
} from '../../Functions/node_mailer';
import { validateNonEmptyStrings } from '../../Helpers/stringValidation';
import { UserRole } from '../../Types/GeneralTypes';
import {
  updateOperatorRequestBody,
  updateOperatorRoleRequestBody,
} from '../../Types/OperatorRequestType';

// * Create operator
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

    validateNonEmptyStrings([email, firstName, lastName]);

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

// * edit operator
const updateOperatorRole = async (
  reqBody: updateOperatorRoleRequestBody,
  myId: number
) => {
  try {
    const editedUser = await prisma.operators.update({
      where: {
        id: Number(reqBody?.opId),
      },
      data: {
        user_role: reqBody.role,
        edited_by: myId,
        updated_at: new Date(),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        user_role: true,
        email: true,
        edited_by: true,
        updated_at: true,
      },
    });

    return editedUser;
  } catch {
    throw new Error('failed to update the users details');
  }
};

// * edit operator role
const updateOperatorDetails = async (
  reqBody: updateOperatorRequestBody,
  myId: number
) => {
  try {
    const email = reqBody.email?.trim().toLocaleLowerCase();
    const firstName = reqBody.firstName?.trim();
    const lastName = reqBody.lastName?.trim();

    if (email) validateNonEmptyStrings([email]);
    if (firstName) validateNonEmptyStrings([firstName]);
    if (lastName) validateNonEmptyStrings([lastName]);

    const user = await prisma.operators.findUnique({
      where: {
        id: Number(reqBody.opId),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        edited_by: true,
      },
    });

    const editedUser = await prisma.operators.update({
      where: {
        id: user?.id,
      },
      data: {
        first_name: firstName || user?.first_name,
        last_name: lastName || user?.last_name,
        email: email || user?.email,
        edited_by: myId,
        updated_at: new Date(),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        edited_by: true,
        updated_at: true,
      },
    });

    return editedUser;
  } catch {
    throw new Error('Failed to update the users permission level');
  }
};

const getAllOperators = async () => {
  const operators = await prisma.operators.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      user_role: true,
      profile_picture: true,
      is_verified: true,
      updated_at: true,
    },
  });

  return operators;
};

const getOperatorDetails = async (operatorId: number) => {
  const operator = await prisma.operators.findUniqueOrThrow({
    where: { id: operatorId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      user_role: true,
      profile_picture: true,
      is_terminated: true,
      is_verified: true,
      updated_at: true,
      login_attempt: true,
      last_login_time: true,
      last_active_time: true,
    },
  });

  return operator;
};

const forgotPasswordService = async (operatorId: number) => {
  const verificationCode = generateVerificationCode();

  const operator = await prisma.operators.findUniqueOrThrow({
    where: { id: operatorId },
    select: {
      is_verified: true,
      id: true,
      email: true,
      first_name: true,
      last_name: true,
    },
  });

  if (!operator.is_verified)
    throw new Error(
      'Can not reset password for users who are not registered'
    );

  await prisma.operators.update({
    where: {
      id: operatorId,
    },
    data: {
      verfication_code: verificationCode,
      updated_at: new Date(),
    },
  });

  await sendOperatorForgetPassword(
    operator.id,
    operator.email,
    operator.first_name,
    operator.last_name,
    verificationCode
  );

  return operator;
};

export {
  createOperator,
  updateOperatorDetails,
  updateOperatorRole,
  getAllOperators,
  getOperatorDetails,
  forgotPasswordService,
};
