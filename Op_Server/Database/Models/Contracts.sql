CREATE TABLE Contracts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  company_id INTEGER NOT NULL,
  pattern_id INTEGER,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  added_by INT NOT NULL,
  updated_by INT,
  
  contract_type Contract_Type_Enum NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,

  contracted_working_hours_per_week_in_minutes INTEGER NOT NULL DEFAULT 480,
  full_time_working_hours_per_week_in_minutes INTEGER NOT NULL,
  contracted_working_days_per_week INTEGER DEFAULT 0 NOT NULL,
  average_working_day INTEGER NOT NULL DEFAULT 480,
  is_leave_in_days BOOLEAN NOT NULL DEFAULT true,
  companies_full_time_annual_leave_entitlement INTEGER NOT NULL DEFAULT 0,
  contracted_annual_leave_entitlement INTEGER NOT NULL DEFAULT 0,
  this_years_annual_leave_allowence INTEGER NOT NULL DEFAULT 0,
  term_time_id INTEGER,

  discarded_id INTEGER,
  discarded_xnumber INTEGER,

  -- check start day does noy == end day has been removed
  CONSTRAINT check_days_per_week_dont_exceed_7 CHECK (contracted_working_days_per_week >= 0 AND contracted_working_days_per_week <= 7), -- when calculating annual leave in hours
  CONSTRAINT contracted_working_hours_per_week_in_minutes_limit CHECK ((contracted_working_hours_per_week_in_minutes > 0 AND contracted_working_hours_per_week_in_minutes <= 10080) OR NULL),
  CONSTRAINT full_time_working_hours_per_week_limit CHECK (full_time_working_hours_per_week_in_minutes >= 0 AND full_time_working_hours_per_week_in_minutes <= 10080),
  CONSTRAINT contract_type_check CHECK (
    (contract_type = 'regular' AND pattern_id IS NOT NULL AND pattern_id > 0) OR
    (contract_type = 'agency' AND pattern_id IS NULL) OR
    (contract_type = 'variable' AND pattern_id IS NULL)
  ),
  CONSTRAINT avrage_working_day_limit CHECK (average_working_day >= 0 AND average_working_day <= 1440), -- when calculating annual leave in days
  CONSTRAINT companies_full_time_annual_leave_entitlement_limit CHECK (companies_full_time_annual_leave_entitlement >= 0),
  CONSTRAINT contracted_annual_leave_entitlement_limit CHECK (contracted_annual_leave_entitlement >= 0),
  CONSTRAINT this_years_annual_leave_allowence_limit CHECK (this_years_annual_leave_allowence >= 0),
  CONSTRAINT term_time_contracts_have_term_time_id CHECK (term_time_id >= 0),
  CONSTRAINT check_start_date_not_after_end_date CHECK (start_date <= end_date),

  FOREIGN KEY (user_id) REFERENCES Users (id),
  FOREIGN KEY (company_id) REFERENCES Companies (id)
);