ALTER TABLE auth.user FORCE ROW LEVEL SECURITY;

CREATE POLICY user_self_select
    ON auth.user
    FOR SELECT
    USING (email = current_setting('app.current_user_email')::TEXT);

CREATE POLICY user_self_update
    ON auth.user
    FOR UPDATE
    USING (email = current_setting('app.current_user_email')::TEXT)
    WITH CHECK (email = current_setting('app.current_user_email')::TEXT);

CREATE POLICY user_self_delete
    ON auth.user
    FOR DELETE
    USING (email = current_setting('app.current_user_email')::TEXT);
