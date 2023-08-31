const bcrypt = require('bcrypt');
const Client = require('pg').Client;

async function seed() {
  async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  const firstName = 'Sudo';
  const lastName = 'User';
  const email = 'sudo@devisehr.com';
  const plainPassword = 'password123'; // Replace with the actual plain password

  const hashedPassword = await hashPassword(plainPassword);

  const user = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password_hash: hashedPassword,
    is_terminated: false,
    user_role: 'root',
    // Other user data...
  };

  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'DeviseHR',
    password: '890899000',
    port: 5432,
  });
  client.connect();
  async function insertUser(user) {
    try {
      const opquery = `
      INSERT INTO Operators (first_name, last_name, email, password_hash, profile_picture, is_terminated, user_role, refresh_tokens, is_verified, added_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

      const opvalues = [
        user.first_name,
        user.last_name,
        user.email,
        user.password_hash,
        user.profile_picture,
        user.is_terminated,
        user.user_role,
        user.refresh_tokens,
        true,
        1,
      ];

      await client.query(opquery, opvalues);

      const companiesquery = `
  INSERT INTO companies (name, licence_number, phone_number, expiration_date, added_by_operator, max_users_allowed, account_number)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING id;
`;

      const companyValues = [
        'DeviseHR',
        '222222',
        '2222222',
        '2023-12-31T23:59:59Z',
        1,
        20,
        '22222',
      ];

      const { rows } = await client.query(
        companiesquery,
        companyValues
      );
      const companyId = rows[0].id;

      const userQuery = `
  INSERT INTO users (first_name, last_name, email, added_by_user, added_by_operator, user_role, password_hash, is_verified, company_id)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
`;

      const userValues = [
        'qader',
        'baghi',
        'query.baghi@devisehr.com',
        20,
        1,
        'admin',
        hashedPassword,
        true,
        companyId,
      ];

      await client.query(userQuery, userValues);
      console.log('User inserted successfully.');
    } catch (error) {
      console.error('Error inserting user:', error);
    } finally {
      client.end();
    }
  }

  // Call the insertUser function with the prepared user object
  insertUser(user);
}

seed();
