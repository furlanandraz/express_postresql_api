import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routeDir = 'routes';
const outputDir = path.resolve(__dirname, routeDir);

import { god } from '#clients';

import renderLayoutServer from './templates/renderLayoutServer.js';
import renderLayout from './templates/renderLayout.js';
import renderPageServer from './templates/renderPageServer.js';
import renderPage from './templates/renderPage.js';

async function buildFiles(route, parentId, buildPath) {

    if (route.layout_id) {
        
        const layoutServer = path.join(buildPath, '+layout.server.js');
        const layoutServerContent = renderLayoutServer(route);
        fs.writeFileSync(layoutServer, layoutServerContent);
        
        const layout = path.join(buildPath, parentId === null ? '+layout.svelte' : '+layout@.svelte');
        const layoutContent = await renderLayout(route);
        fs.writeFileSync(layout, layoutContent);
    }

    const pageServer = path.join(buildPath, '+page.server.js');
    const pageServerContent = renderPageServer(route);
    fs.writeFileSync(pageServer, pageServerContent);

    const page = path.join(buildPath, '+page.svelte');
    const pageContent = await renderPage(route);
    fs.writeFileSync(page, pageContent);

}

async function buildRoutes(routes, parentId = null, buildPath = outputDir) {

    try { 
        for (const route of routes.filter(route => route.parent_id === parentId)) {
            const folderName = route.url_type === 'Dynamic' ? `[${route.url_name}]` : route.url_name;
            const folderPath = path.join(buildPath, folderName);
            fs.mkdirSync(folderPath, { recursive: true });
            await buildFiles(route, parentId, folderPath);
            await buildRoutes(routes, route.id, folderPath);
        };
        return true;
    } catch (err) {
        console.error("Error building routes:", err);
        return false;
    }
}

(async function init() {
    try {
        fs.rmSync(outputDir, { recursive: true, force: true }, err => {
            if (err) console.log(err)
        });
        const { rows: routes } = await god.query("SELECT * FROM navigation.route_layout_page ORDER BY id;");
        const success = await buildRoutes(routes);
        if (success) {
            console.log("Routes built successfully.");
            process.exit(0);
        } else {
            console.error("Failed to build routes.");
            process.exit(1);
        }
    } catch (err) {
        console.error("Error in routes", err);
        process.exit(1);
    }
    
})();


