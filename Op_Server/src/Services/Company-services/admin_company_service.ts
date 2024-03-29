import { prisma } from '../../DB/prismaConfig';
import { createCompanyFilter } from '../../Functions/filter_functions';
import {
  isValidEmail,
  validateNonEmptyStrings,
} from '../../Helpers/stringValidation';
import { IAddCompany } from '../../Types/CompanyRequestType';

export const getUserById = async (id: number) => {
  try {
    const user = await prisma.users.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        is_verified: true,
        is_terminated: true,
      },
    });

    return user;
  } catch (err: any) {
    throw new Error('Failed to locate user.');
  }
};

export const createCompany = async (
  reqBody: IAddCompany,
  myId: number
) => {
  createCompanyFilter(reqBody);
  let company;
  if (reqBody.maxEmployeesAllowed <= 0)
    throw new Error(
      'you can not create a company with a max amount of employees of zero'
    );
  try {
    company = await prisma.companies.create({
      data: {
        name: reqBody.companyName,
        licence_number: reqBody.licenceNumber,
        phone_number: reqBody.phoneNumber,
        expiration_date: reqBody.expirationDate + 'T23:59:59Z',
        added_by_operator: myId,
        max_users_allowed: reqBody.maxEmployeesAllowed,
        account_number: reqBody.accountNumber,
        annual_leave_start_date: '1970-01-01T00:00:00.000Z',
        users: {
          create: {
            first_name: reqBody.firstName,
            last_name: reqBody.lastName,
            email: reqBody.email,
            added_by_user: 0,
            added_by_operator: myId,
            user_role: 'admin',
            annual_leave_start_date: '1970-01-01T00:00:00.000Z',
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
  } catch (err: any) {
    return err;
  }

  try {
    await prisma.companies.update({
      where: {
        id: company.id,
      },
      data: {
        main_contact_id: company.users[0].id,
      },
    });
  } catch (err: any) {
    return err.message;
  }

  return company;
};

export const updateUserVerificationToken = async (
  userId: number,
  verificationCode: string
) => {
  const user = await getUserById(userId);

  if (!user) throw new Error('Failed to locate user.');

  if (user.is_terminated)
    throw new Error('Can not register a terminated user');

  if (user.is_verified) throw new Error('User Already registered');

  try {
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
  } catch (err: any) {
    throw new Error('Failed to update user verification code.');
  }
};
