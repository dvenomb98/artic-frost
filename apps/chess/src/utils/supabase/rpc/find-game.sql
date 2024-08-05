CREATE OR REPLACE FUNCTION find_game(user_id UUID)
RETURNS TABLE (id bigint) AS $$
BEGIN
    RETURN QUERY
    SELECT "GAMES_DATA".id FROM "GAMES_DATA"
    WHERE EXISTS (
        SELECT 1
        FROM jsonb_array_elements(users) AS user_alias
        WHERE user_alias->>'id' IS NULL
    ) AND EXISTS (
        SELECT 1
        FROM jsonb_array_elements(users) AS user_alias
        WHERE user_alias->>'id' <> user_id::text
    )
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;