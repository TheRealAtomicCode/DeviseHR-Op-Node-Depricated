import { prisma } from '../../DB/prismaConfig';
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
  //* validations and trims
  reqBody.companyName = reqBody.companyName.trim();
  reqBody.firstName = reqBody.firstName.trim();
  reqBody.lastName = reqBody.lastName.trim();
  reqBody.email = reqBody.email.trim();
  reqBody.phoneNumber = reqBody.phoneNumber.trim();
  reqBody.licenceNumber = reqBody.licenceNumber.trim();
  reqBody.accountNumber = reqBody.accountNumber.trim();
  isValidEmail(reqBody.email);
  validateNonEmptyStrings([
    reqBody.companyName,
    reqBody.firstName,
    reqBody.lastName,
    reqBody.phoneNumber,
    reqBody.accountNumber,
  ]);

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
