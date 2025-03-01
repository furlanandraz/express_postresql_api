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

    const layoutContent = await renderLayout(route);

    if (layoutContent) {
        
        const layout = path.join(buildPath, parentId === null ? '+layout.svelte' : '+layout@.svelte');
        fs.writeFileSync(layout, layoutContent);
        
        const layoutServerContent = renderLayoutServer(route);
        const layoutServer = path.join(buildPath, '+layout.server.js');
        fs.writeFileSync(layoutServer, layoutServerContent);
        
    }

    const pageContent = await renderPage(route);

    // && route.type != 'dynamic' - dynamic routes don't have pages, only layout
    if (!pageContent) {
        
        const page = path.join(buildPath, '+page.svelte');
        fs.writeFileSync(page, pageContent);
        
        const pageServerContent = renderPageServer(route);
        const pageServer = path.join(buildPath, '+page.server.js');
        fs.writeFileSync(pageServer, pageServerContent);
    }

    
}

async function buildRoutes(routes, parentId = null, buildPath = outputDir) {

    try { 
        for (const route of routes.filter(route => route.parent_id === parentId)) {
            const folderName = route.url_type === 'dynamic' ? `[${route.url_name}]` : route.url_name;
            const folderPath = path.join(buildPath, folderName);
            fs.mkdirSync(folderPath, { recursive: true });

            // in subsequent folder, dynamic/static need to differentiate - the load function for template is different for the two - dynamic uses slug to fetch from multiple
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
        fs.readdirSync(outputDir).forEach(file => {
        const filePath = path.join(outputDir, file);
        if (file !== 'api') {
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    });
        const { rows: routes } = await god.query("SELECT * FROM navigation.route ORDER BY id;");
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


