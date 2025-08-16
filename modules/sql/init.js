import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import dotenv from 'dotenv';

dotenv.config();

const deleteTmp = false;

const pgOwner = process.env.PG_GOD_USER
const pgPassword = process.env.PG_GOD_PASSWORD;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sqlDir = __dirname;
const tmpFile = path.join(__dirname, 'tmp.sql');

function sqlCrawler(directory) {
    let partial = '';
    
    const allFiles = fs.readdirSync(directory);
    const files = allFiles.filter(file => file.endsWith('.sql') && file);
    const dirs = allFiles.filter(dir => fs.statSync(path.join(directory, dir)).isDirectory());

    files.sort((a, b) => {
        const aNum = parseInt(a.split('_')[0], 10);
        const bNum = parseInt(b.split('_')[0], 10);
        return aNum - bNum;
    });
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        partial += fs.readFileSync(fullPath, 'utf8') + '\n';
    });
    dirs.sort((a, b) => {
        const aNum = parseInt(a.split('_')[0], 10);
        const bNum = parseInt(b.split('_')[0], 10);
        return aNum - bNum;
    });
    dirs.forEach(dir => {
        const fullPath = path.join(directory, dir);
        partial += sqlCrawler(fullPath);
    });
    
    return partial;
}

(async function init() {
    const combined = sqlCrawler(sqlDir);
    await fs.promises.writeFile(tmpFile, combined, 'utf8');
    try {
        const result = await execa("psql", ["-U", pgOwner, "-f", tmpFile], {
            env: {
                PGPASSWORD: pgPassword,
                PGCLIENTENCODING: "UTF8"
            }, // Set environment variables
            stdio: "inherit", // Redirect stdout and stderr to the console
        });
        
    } catch (error) {
        console.error(error);
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
        process.exit(1);
    } finally {
        if (fs.existsSync(tmpFile) && deleteTmp) {
            fs.unlinkSync(tmpFile);
        }
        console.log('Building done'); 
    }
        process.exit(0);
})();



