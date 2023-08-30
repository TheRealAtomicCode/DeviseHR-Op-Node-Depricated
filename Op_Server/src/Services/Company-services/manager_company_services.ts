import { prisma } from '../../DB/prismaConfig';
import { addUserFilter } from '../../Functions/filter_functions';
import {
  isValidEmail,
  validateNonEmptyStrings,
} from '../../Helpers/stringValidation';
import { IAddUserRequest } from '../../Types/OperatorRequestType';

const updateEmailById = async (
  userId: number,
  email: string,
  myId: number
) => {
  email = email.trim();
  isValidEmail(email);

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

const addUserToCompany = async (
  reqBody: IAddUserRequest,
  myId: number
) => {
  addUserFilter(reqBody);

  try {
    const addedUser = await prisma.users.create({
      data: {
        first_name: reqBody.firstName,
        last_name: reqBody.lastName,
        email: reqBody.email,
        added_by_operator: myId,
        added_by_user: 0,
        user_role: reqBody.userRole,
        company_id: reqBody.companyId,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        added_by_operator: true,
        added_by_user: true,
        user_role: true,
        company_id: true,
      },
    });

    return addedUser;
  } catch (err: any) {
    throw new Error('Failed to add user to company');
  }
};

const updateMainContact = async (
  companyId: number,
  userId: number,
  myId: number
) => {
  const company = await prisma.companies.update({
    where: {
      id: companyId,
      users: {
        some: {
          id: userId,
        },
      },
    },
    data: {
      main_contact_id: userId,
      updated_at: new Date(),
      updated_by_operator: myId,
    },
    select: {
      id: true,
      name: true,
      main_contact_id: true,
    },
  });

  return company;
};

export { updateEmailById, addUserToCompany, updateMainContact };
