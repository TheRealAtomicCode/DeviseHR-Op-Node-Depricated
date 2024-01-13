CREATE TYPE operator_role_enum AS ENUM ('root', 'sudo', 'admin', 'manager', 'employee');
CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'employee');


CREATE TYPE Contract_Type_Enum AS ENUM ('regular', 'variable', 'agency');

-- update last contract end date
CREATE TYPE contract_record AS (
  id INT,
  start_date DATE,
  end_date DATE,
  updated_by INT
);
