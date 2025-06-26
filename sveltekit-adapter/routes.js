import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { god } from '#DAO/clients/index.js';
import config from './templates/config.js';

import renderLayoutServer from './templates/renderLayoutServer.js';
import renderLayout from './templates/renderLayout.js';
import renderPageServer from './templates/renderPageServer.js';
import renderPage from './templates/renderPage.js';
import renderSlugServer from './templates/renderSlugServer.js';
import renderSlug from './templates/renderSlug.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routeDir = 'routes';
const outputDir = path.resolve(__dirname, routeDir);

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
    const page = path.join(buildPath, '+page.svelte');
    fs.writeFileSync(page, pageContent);

    if (pageContent){
        const pageServerContent = renderPageServer(route);
        const pageServer = path.join(buildPath, '+page.server.js');
        fs.writeFileSync(pageServer, pageServerContent);
    }
    

    
    
}

async function buildSlug(route, buildPath) {

    const slugPath = path.join(buildPath, '[slug]');
    fs.mkdirSync(slugPath, { recursive: true });

    const slugContent = await renderSlug(route);
    if (slugContent){
        const layout = path.join(slugPath, '+layout@.svelte');
        fs.writeFileSync(layout, slugContent);
        
        const slugServerContent = renderSlugServer();
        const slugServer = path.join(slugPath, '+layout.server.js');
        fs.writeFileSync(slugServer, slugServerContent);

        const slugPage = path.join(slugPath, '+page.svelte');
        fs.writeFileSync(slugPage, '');

    }
    
}

async function buildRoutes(routes, parentId = null, buildPath = outputDir) {

    try { 
        for (const route of routes.filter(route => route.parent_id === parentId)) {
            const folderName = route.slug;
            const folderPath = path.join(buildPath, folderName);
            fs.mkdirSync(folderPath, { recursive: true });

            await buildFiles(route, parentId, folderPath);
            await buildRoutes(routes, route.id, folderPath);

            if (route.url_type === 'dynamic') {
                await buildSlug(route, folderPath);
            }
        };
        return true;
    } catch (err) {
        console.error("Error building routes:", err);
        return false;
    }

}


function cleanup(dir) {
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            cleanup(filePath);
        }

        if (fs.statSync(filePath).isDirectory() && fs.readdirSync(filePath).length === 0) {
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    });
}


(async function init() {

    try {
        fs.readdirSync(outputDir).forEach(file => {
        const filePath = path.join(outputDir, file);
        if (!config.avoid.includes(file)) {
            fs.rmSync(filePath, { recursive: true, force: true });
        }
    });
        const { rows: routes } = await god.query("SELECT * FROM navigation.route ORDER BY id;");
        // can be replaced with Navigation.getRouteItems();
        
        const success = await buildRoutes(routes);
        if (success) {
            console.log("Routes built successfully.");
        } else {
            console.error("Failed to build routes.");
            process.exit(1);
        }
    } catch (err) {
        console.error("Error in routes", err);
        process.exit(1);
    } finally {
        cleanup(outputDir);
        process.exit(0);
    }
    
})();


