CREATE OR REPLACE FUNCTION edit_user_roles(
  IN user_ids INT[],
  IN user_roles TEXT[],
  IN role_ids INT[],
  IN company_id_param INT,
  IN exclude_user_id INT
)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
DECLARE
  i INT;
  selected_user TEXT;
  affected_row users%rowtype;
BEGIN
  -- Start the transaction

  -- Check if the number of user IDs and user roles is equal
  IF array_length(user_ids, 1) <> array_length(user_roles, 1) THEN
    RAISE EXCEPTION 'Number of user IDs and user roles must be equal';
  END IF;

  -- Update user roles
  IF array_length(user_ids, 1) IS NOT NULL THEN
    FOR i IN 1..array_length(user_ids, 1) LOOP
      IF user_ids[i] != exclude_user_id THEN
        IF user_roles[i] = 'manager' THEN
          -- Use the corresponding role_id from the role_ids array
          UPDATE users
          SET user_role = 'manager',
              role_id = role_ids[i]
          WHERE id = user_ids[i]
            AND company_id = company_id_param
			AND EXISTS (
                            SELECT company_id, id
                            FROM Roles
                            WHERE id = role_ids[i] AND company_id = company_id_param
                        )
          RETURNING * INTO affected_row;

        ELSIF user_roles[i] = 'employee' OR user_roles[i] = 'admin' THEN
          -- For roles other than 'manager', keep the existing user_role value
          UPDATE users
          SET user_role = user_roles[i]::user_role_enum,
              role_id = null
          WHERE id = user_ids[i] AND company_id = company_id_param
          RETURNING * INTO affected_row;
          DELETE FROM Hierarchies
          WHERE manager_id = user_ids[i];

        ELSE
          RAISE EXCEPTION 'Cannot update your own role: %', user_roles[i];
        END IF;
      END IF;
    END LOOP;
  END IF;

  -- Return the affected rows
  RETURN QUERY SELECT * FROM users WHERE id = ANY(user_ids) AND company_id = company_id_param;

END $$;





CREATE OR REPLACE FUNCTION edit_subordinates(
  IN managers_to_be_added INT[],
  IN subordinates_to_be_added INT[],
  IN managers_to_be_removed INT[],
  IN subordinates_to_be_removed INT[],
  IN company_id_param INT,
  IN exclude_user_id INT
)
RETURNS SETOF users
LANGUAGE plpgsql
AS $$
DECLARE
  i INT;
  affected_row users%rowtype;
BEGIN

  -- Check if the number of managers to be added == subordinates to be added
  IF array_length(managers_to_be_added, 1) <> array_length(subordinates_to_be_added, 1) THEN
    RAISE EXCEPTION 'Number of user IDs and user roles must be equal';
  END IF;
  -- Check if the number of managers to be removed == subordinates to be removed
  IF array_length(managers_to_be_removed, 1) <> array_length(subordinates_to_be_removed, 1) THEN
    RAISE EXCEPTION 'Number of user IDs and user roles must be equal';
  END IF;

-- If statement to remove subordinates
    IF array_length(managers_to_be_removed, 1) > 0 AND array_length(subordinates_to_be_removed, 1) > 0 THEN
      FOR i IN 1..array_length(managers_to_be_removed, 1) LOOP

        -- check if the manager id or subordinate id is = to my id
        IF managers_to_be_removed[i] = exclude_user_id THEN
          RAISE EXCEPTION 'Can not remove your own subordinate: %', subordinates_to_be_removed[i];
        END IF;

        -- Check manager role
        IF NOT EXISTS (
            SELECT user_role
            FROM users
            WHERE id = managers_to_be_removed[i]
                AND company_id = company_id_param
                AND user_role = 'manager'
        )
        THEN
            RAISE EXCEPTION 'Manager not found.';
        END IF;

        -- Check subordinate role
        IF NOT EXISTS (
            SELECT user_role
            FROM users
            WHERE id = subordinates_to_be_removed[i]
                AND company_id = company_id_param
                AND user_role != 'manager'
        )
        THEN
            RAISE EXCEPTION 'Subordinate not found.';
        END IF;

        IF (SELECT user_role FROM users WHERE id = subordinates_to_be_removed[i] AND company_id = company_id_param) = 'manager' OR NULL THEN
          RAISE EXCEPTION 'The user with ID % cannot be a manager.', subordinates_to_be_removed[i];
        END IF;

        -- Delete from Hierarchies table
        DELETE FROM Hierarchies
        WHERE manager_id = managers_to_be_removed[i] AND subordinate_id = subordinates_to_be_removed[i];
      END LOOP;
    END IF;



    -- If statement to add subordinates
    IF array_length(managers_to_be_added, 1) > 0 AND array_length(subordinates_to_be_added, 1) > 0 THEN
      FOR i IN 1..array_length(subordinates_to_be_added, 1) LOOP

        -- check if the manager id or subordinate id is = to my id
        IF managers_to_be_added[i] = exclude_user_id THEN
          RAISE EXCEPTION 'Can not add your own subordinate';
        END IF;

       -- Check manager role
        IF NOT EXISTS (
            SELECT user_role
            FROM users
            WHERE id = managers_to_be_added[i]
                AND company_id = company_id_param
                AND user_role = 'manager'
        )
        THEN
           RAISE EXCEPTION 'Manager not found.';
        END IF;

        -- Check subordinate role
        IF NOT EXISTS (
            SELECT user_role
            FROM users
            WHERE id = subordinates_to_be_added[i]
                AND company_id = company_id_param
                AND user_role != 'manager'
        )
        THEN
            RAISE EXCEPTION 'Subordinate not found.';
        END IF;

        -- Insert into Hierarchies table
        INSERT INTO Hierarchies (manager_id, subordinate_id)
        VALUES (managers_to_be_added[i], subordinates_to_be_added[i]);
      END LOOP;
    END IF;

  -- Return the affected rows
  RETURN QUERY SELECT * FROM users WHERE id = ANY(user_ids) AND company_id = company_id_param;

END $$;

 
