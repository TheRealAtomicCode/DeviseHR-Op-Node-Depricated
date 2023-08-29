import { prisma } from '../../DB/prismaConfig';
import { createCompanyFilter } from '../../Functions/filter_functions';
import {
  isValidEmail,
  validateNonEmptyStrings,
} from '../../Helpers/stringValidation';
import { IAddCompany } from '../../Types/CompanyRequestType';

export const getUserById = async (id: number) => {
  const user = await prisma.users.findUniqueOrThrow({
    where: { id },
    select: {
      first_name: true,
      last_name: true,
      email: true,
    },
  });

  return user;
};

export const createCompany = async (
  reqBody: IAddCompany,
  myId: number
) => {
  createCompanyFilter(reqBody);

  const company = await prisma.companies.create({
    data: {
      name: reqBody.companyName,
      licence_number: reqBody.licenceNumber,
      phone_number: reqBody.phoneNumber,
      expiration_date: reqBody.expirationDate,
      added_by_operator: myId,
      max_users_allowed: reqBody.maxEmployeesAllowed,
      account_number: reqBody.accountNumber,
      users: {
        create: {
          first_name: reqBody.firstName,
          last_name: reqBody.lastName,
          email: reqBody.email,
          added_by_user: 0,
          added_by_operator: myId,
          user_role: 'admin',
        },
      },
    },
    select: {
      id: true,
      name: true,
      licence_number: true,
      phone_number: true,
      expiration_date: true,
      added_by_operator: true,
      max_users_allowed: true,
      account_number: true,
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          added_by_user: true,
        },
      },
    },
  });

  await prisma.companies.update({
    where: {
      id: company.id,
    },
    data: {
      main_contact_id: company.users[0].id,
    },
  });

  return company;
};

export const updateUserVerificationToken = async (
  userId: number,
  verificationCode: string
) => {
  const user = await prisma.users.update({
    where: { id: userId },
    data: {
      verification_code: verificationCode,
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
