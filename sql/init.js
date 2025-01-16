import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import dotenv from 'dotenv';


dotenv.config();

const PgOwner = process.env.PG_GOD_USER
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
        a = parseInt(a.split('_')[0], 10);
        b = parseInt(b.split('_')[0], 10);
        return a - b;
    });
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        partial += fs.readFileSync(fullPath, 'utf-8') + '\n';
    });

    dirs.sort((a, b) => {
        a = parseInt(a.split('_')[0], 10);
        b = parseInt(b.split('_')[0], 10);
        return a - b;
    });
    dirs.forEach(dir => {
        const fullPath = path.join(directory, dir);
        partial += sqlCrawler(fullPath);
    });
    
    return partial;
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error executing psql: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`psql stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}

(async function init() {
    const combined = sqlCrawler(sqlDir);
    fs.writeFileSync(tmpFile, '', 'utf-8');
    fs.writeFileSync(tmpFile, combined, 'utf-8');

    const command = process.platform === 'win32'
        ? `cross-env PGPASSWORD="${pgPassword}" psql -U ${PgOwner} -f ${tmpFile}`  // Windows
        : `PGPASSWORD=${pgPassword} psql -U ${PgOwner} -f ${tmpFile}`;         // Linux/macOS

    try {
        const result = await execPromise(command);
        console.log(`psql stdout: ${result}`);
    } catch (error) {
        console.error(error);
    } finally {
        if (fs.existsSync(tmpFile)) {
            fs.unlinkSync(tmpFile);
        }
    }
})();



