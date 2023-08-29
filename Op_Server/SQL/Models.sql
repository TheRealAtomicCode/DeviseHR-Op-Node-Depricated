DROP TABLE Users;
DROP TABLE Companies;
DROP TABLE Notes;
DROP TABLE Operators;
DROP TYPE operator_role_enum;
DROP TYPE user_role_enum;

CREATE TYPE operator_role_enum AS ENUM ('root', 'sudo', 'admin', 'manager', 'employee');
CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'employee');

CREATE TABLE Operators (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  email VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(60),
  profile_picture TEXT,
  is_terminated BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  user_role operator_role_enum NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  refresh_tokens TEXT[] DEFAULT ARRAY[]::TEXT[],
  added_by INT NOT NULL,
  updated_by_oprtator INT,
  verfication_code VARCHAR(10),
  login_attempt SMALLINT DEFAULT 0,
  last_login_time TIMESTAMP,
  last_active_time TIMESTAMP
);

CREATE TABLE Notes (
  id SERIAL PRIMARY KEY,
  operatorId INTEGER REFERENCES Operators(id),
  companyId INTEGER,
  noteContent TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- other db
CREATE TABLE Companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  licence_number VARCHAR(255) NOT NULL,
  account_number VARCHAR(6) NOT NULL UNIQUE,
  logo TEXT,
  enable_semi_personal_information BOOLEAN NOT NULL DEFAULT false,
  enable_show_employees BOOLEAN NOT NULL DEFAULT false,
  enable_toil BOOLEAN NOT NULL DEFAULT false,
  enable_overtime BOOLEAN NOT NULL DEFAULT false,
  enable_absence_conflicts_outside_departments BOOLEAN NOT NULL DEFAULT false,
  enable_carryover BOOLEAN NOT NULL DEFAULT false,
  enable_self_cancel_leave_requests BOOLEAN NOT NULL DEFAULT false,
  enable_edit_my_information BOOLEAN NOT NULL DEFAULT false,
  enable_accept_decline_shifts BOOLEAN NOT NULL DEFAULT false,
  enable_takeover_shift BOOLEAN NOT NULL DEFAULT false,
  enable_broadcast_shift_swap BOOLEAN NOT NULL DEFAULT false,
  lang VARCHAR(5),
  country VARCHAR(5),
  main_contact_id INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_special_client BOOLEAN NOT NULL DEFAULT false,
  max_users_allowed INT NOT NULL,
  security_question_one VARCHAR(60),
  security_question_two VARCHAR(60),
  security_answer_two VARCHAR(60),
  expiration_date TIMESTAMP NOT NULL,
  phone_number VARCHAR(14) NOT NULL,
  added_by_operator INT NOT NULL,
  updated_by_operator INT
);

CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  title VARCHAR(20),
  email VARCHAR(60) NOT NULL UNIQUE,
  password_hash VARCHAR(60),
  date_of_birth DATE,
  profile_picture TEXT,
  is_terminated BOOLEAN NOT NULL DEFAULT false,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  refresh_tokens TEXT[] DEFAULT ARRAY[]::TEXT[],
  user_role user_role_enum NOT NULL,
  ni_no VARCHAR(60),
  drivers_licence_number VARCHAR(60),
  drivers_licence_expiration_date DATE,
  passport_number VARCHAR(60),
  passport_expiration_date DATE,
  enable_reminders BOOLEAN NOT NULL DEFAULT false,
  enable_birthday_reminder BOOLEAN NOT NULL DEFAULT false,
  enable_receive_requests BOOLEAN NOT NULL DEFAULT false,
  enable_receive_requests_from_my_department BOOLEAN NOT NULL DEFAULT false,
  contracted_leave_start_date DATE,
  added_by_operator INT NOT NULL,
  added_by_user INT NOT NULL,
  updated_by_operator INT,
  updated_by_user INT,
  verification_code VARCHAR(10),
  login_attempt SMALLINT DEFAULT 0, 
  last_login_time TIMESTAMP,
  last_active_time TIMESTAMP,
  company_id INTEGER,
  FOREIGN KEY (company_id) REFERENCES Companies (id)
);