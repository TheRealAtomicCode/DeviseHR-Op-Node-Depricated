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

  try {
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
  } catch (err: any) {
    throw new Error(
      'Failed to update user as the email already exists, if you are sure the email already exists, please contact the DeviseHR technical support team.'
    );
  }
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
    throw new Error(
      'Failed to add user as the email already exists, if you are sure the email already exists, please contact the DeviseHR technical support team.'
    );
  }
};

const updateMainContact = async (
  companyId: number,
  userId: number,
  myId: number
) => {
  try {
    const company = await prisma.companies.update({
      where: {
        id: companyId,
        users: {
          some: {
            id: userId,
            is_terminated: false,
            is_verified: true,
            user_role: 'admin',
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
  } catch (err: any) {
    throw new Error(
      'Unable to update main contact, to update a user as a main contact, the user must be a member of the company, an admin, verified, and not terminated'
    );
  }
};

const toggleTermination = async (userId: number, myId: number) => {
  let user;
  let updatedUser;

  // no need to check if my id is == user is as i am an operator
  try {
    user = await prisma.users.findUniqueOrThrow({
      where: {
        id: userId,
      },
      select: {
        id: true,
        is_terminated: true,
      },
    });
  } catch (err: any) {
    throw new Error('Failed to locate user.');
  }

  try {
    updatedUser = await prisma.users.update({
      where: {
        id: userId,
        companies: {
          main_contact_id: {
            not: userId,
          },
        },
      },
      data: {
        is_terminated: !user.is_terminated,
        updated_by_operator: myId,
        updated_at: new Date(),
      },
      select: {
        id: true,
        is_terminated: true,
      },
    });
    return updatedUser;
  } catch (err: any) {
    throw new Error(
      'Failed to terminate user, please make sure the user is not a main contact.'
    );
  }
};

export {
  updateEmailById,
  addUserToCompany,
  updateMainContact,
  toggleTermination,
};
