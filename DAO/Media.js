import { god } from '#clients';
import { arrayOfObjectsToVALUES } from './functions/helpers.js';

class Media {
    static async insertImages(files, tags) {
        const array = files.map(file => {return { name: file, tags: tags }});
        const values = arrayOfObjectsToVALUES(array);
        try {
            await god.query(`
                INSERT INTO media.image (name, tags)
                VALUES ${values}
                ON CONFLICT (name) DO NOTHING
                RETURNING name;
                `);
        } catch (error) {
            console.error('Databse error:', error);
            return { error: 'Database error' };
        }
    }
}

export default Media;