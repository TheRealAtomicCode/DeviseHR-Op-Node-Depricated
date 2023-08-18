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
    const query = `
      INSERT INTO Operators (first_name, last_name, email, password_hash, profile_picture, is_terminated, user_role, refresh_tokens, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      user.first_name,
      user.last_name,
      user.email,
      user.password_hash,
      user.profile_picture,
      user.is_terminated,
      user.user_role,
      user.refresh_tokens,
      true,
    ];

    try {
      await client.query(query, values);
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
