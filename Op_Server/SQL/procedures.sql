CREATE OR REPLACE PROCEDURE update_refresh_token(
  user_id INTEGER,
  old_refresh_token JSONB,
  new_refresh_token JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE Users
  SET refresh_tokens = array_replace(refresh_tokens, old_refresh_token, new_refresh_token)
  WHERE id = user_id;
END;
$$;