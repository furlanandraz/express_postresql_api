import { god } from '#clients';
import bcrypt from 'bcrypt';
import format from 'pg-format';

class Admin {

    static async login(email, password) {
        const client = await god.connect();
        try {
            console.log('in')
            
            await client.query(format(`SET session "app.current_user_email" = %L`, email));
            const { rows } = await client.query(`
                SELECT id, password, role FROM admin.user WHERE email = $1
            `, [email]);
            
            if (rows.length !== 1) return { error: 'Invalid credentials' };

            const user = rows[0];
            
            const match = await bcrypt.compare(password, user.password);

            if (!match) return { error: 'Invalid credentials' };

            return {
                id: user.id,
                role: user.role
            };

        } catch (error) {
            console.error('Database error:', error);
            return { error: 'Database error' };
        } finally {
            client.release();
        }
    }
}

export default Admin;