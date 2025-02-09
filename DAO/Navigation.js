import Static from "./Static.js";


class Navigation extends Static {

    async getMenuItems() {

        try {
            const result = await this.client.query('SELECT * FROM navigation.route');
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }
}

export default Navigation;