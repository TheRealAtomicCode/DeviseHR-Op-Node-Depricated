import { prisma } from '../../DB/prismaConfig';

const findCompany = async (searchTerm: string) => {
  const companies = await prisma.companies.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { account_number: searchTerm },
      ],
    },
    select: {
      id: true,
      name: true,
      licence_number: true,
      account_number: true,
      expiration_date: true,
      phone_number: true,
      added_by: true,
    },
  });

  return companies;
};

const findUsers = async (searchTerm: string) => {
  const formattedSearchTerm = searchTerm.trim(); // Remove leading and trailing white spaces

  // Split the search term into first and last names
  const nameParts = formattedSearchTerm.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1];

  const users = await prisma.users.findMany({
    where: {
      OR: [
        { first_name: { contains: firstName, mode: 'insensitive' } },
        { last_name: { contains: lastName, mode: 'insensitive' } },
        {
          email: {
            contains: formattedSearchTerm,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      is_terminated: true,
      verification_code: true,
    },
  });

  return users;
};

export { findCompany, findUsers };
