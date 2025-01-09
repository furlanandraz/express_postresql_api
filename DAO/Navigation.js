import * as clients from '#clients';

class Navigation {

    constructor(clientType = 'readonly') {
        this.clientType = clientType;
    }

    static setClient(clientType) {
        return new Navigation(clientType);  // Returns a new instance
    }
    static async getMenuItems() {
        const client = clients[this.clientType];
        try {
            const result = await client.query('SELECT * FROM navigation.menu_item');
            return result.rows;
        } catch (error) {
            return { error: 'Database query error' };
        }
    }
}

export default Navigation;