import clients from '#clients';

const Nav = {
    async getMenuItems(clientType) {
        const client = clients[clientType];
        try {
            const result = await client.query('SELECT * FROM navigation.menu_item');
            return result.rows;
        } catch (error) {
            return { error: 'Database query error' };
        }
    }
}

export default Nav;