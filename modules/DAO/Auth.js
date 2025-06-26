import { god } from '#DAO/clients/index.js';
import bcrypt from 'bcrypt';
import format from 'pg-format';

class Auth {

    static async login(email, password) {
        const client = await god.connect();
        try {            
            await client.query(format(`SET session "app.current_user_email" = %L`, email));
            const { rows } = await client.query(`
                SELECT
                    u.id,
                    u.email,
                    u.password,
                    r.name AS role
                FROM
                    auth.user u
                INNER JOIN 
                    auth.role r
                ON
                    u.role = r.id
                WHERE
                    u.email = $1
            `, [email]);
            
             if (rows.length !== 1) {
                return { emailOk: false };
            }

            const user = rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (!match) return {emailOk: true, passOk: false};

            return {
                emailOk: true,
                passOk: true,
                id: user.id,
                email: user.email,
                role: user.role
            };

        } catch (error) {
            console.error('Database error:', error);
            return null;
        } finally {
            client.release();
        }
    }
}

export default Auth;