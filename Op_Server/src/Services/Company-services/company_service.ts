import { prisma } from '../../DB/prismaConfig';
import {
  isValidEmail,
  validateNonEmptyStrings,
} from '../../Helpers/stringValidation';
import { IAddCompany } from '../../Types/CompanyRequestType';

export const createCompany = async (
  companyRequest: IAddCompany,
  myId: number
) => {
  //* validations and trims
  const companyName = companyRequest.companyName.trim();
  const firstName = companyRequest.firstName.trim();
  const lastName = companyRequest.lastName.trim();
  const email = companyRequest.email.trim();
  const phoneNumber = companyRequest.phoneNumber.trim();
  const licenceNumber = companyRequest.licenceNumber.trim();
  isValidEmail(companyRequest.email);
  validateNonEmptyStrings([
    companyName,
    firstName,
    lastName,
    phoneNumber,
  ]);

  const company = await prisma.companies.create({
    data: {
      name: companyName,
      licence_number: licenceNumber,
      phone_number: phoneNumber,
      expiration_date: companyRequest.expirationDate,
      added_by: myId,
      max_users_allowed: companyRequest.maxEmployeesAllowed,
      users: {
        create: {
          first_name: firstName,
          last_name: lastName,
          email,
          added_by: 0,
        },
      },
    },
    select: {
      id: true,
      name: true,
      licence_number: true,
      phone_number: true,
      expiration_date: true,
      added_by: true,
      max_users_allowed: true,
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          added_by: true,
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
