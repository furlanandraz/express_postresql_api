import Static from "./Static.js";


class Navigation extends Static {

    async getMenuItems() {

        try {
            const result = await this.client.query('SELECT * FROM navigation.menu_item');
            return result.rows;
        } catch (error) {
            console.error('Database query error:', error);
            return { error: 'Database query error' };
        }
    }
}

export default Navigation;