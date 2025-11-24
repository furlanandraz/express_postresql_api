import { god } from "#clients";

class LayoutType {

    static async select(id) {

        const query = `
        SELECT
            *
        FROM
            prototype.layout_type
        WHERE
            id = $1;
        `;
        
        try {
            const result = await god.query(query, [id]);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'LayoutType.select()'
                }
            }
        }
    }

    static async selectList() {

        let query = `
        SELECT
            id AS layout_type_id,
            title AS layout_type_title
        FROM
            prototype.layout_type;
        `;
        
        try {
            const result = await god.query(query);
            return result;
        } catch (error) {
            return {
                error: 'Database query error',
                details: {
                    method: 'LayoutType.selectList()'
                }
            }
        }
    }
}

export default LayoutType;