import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const routeDir = 'routes';
const outputDir = path.resolve(__dirname, routeDir);

fs.rmSync(outputDir, { recursive: true, force: true }, err => {
    if (err) console.log(err)
});

import { god } from '#clients';

const { rows: routes } = await god.query("SELECT id, parent_id, url_name, route_type FROM navigation.route_layout_page ORDER BY id;");

function buildFiles(route, parentId, buildPath) {
    const layoutServer = path.join(buildPath, '+layout.server.js');
    console.log(layoutServer, "\n\n\n");
    fs.writeFileSync(layoutServer, '');
    const layout = path.join(buildPath, parentId === null ? '+layout.svelte' : '+layout@.svelte');
    fs.writeFileSync(layout, '');
    const pageServer = path.join(buildPath, '+page.server.js');
    fs.writeFileSync(pageServer, '');
    const page = path.join(buildPath, '+page.svelte');
    fs.writeFileSync(page, '');

}

(function buildRoutes(routes, parentId = null, buildPath = outputDir) {

    routes
        .filter(route => route.parent_id === parentId)
        .forEach(route => {
            const folderName = route.route_type === 'Dynamic' ? `[${route.url_name}]` : route.url_name;
            const folderPath = path.join(buildPath, folderName);
            
            

            fs.mkdirSync(folderPath, { recursive: true });
            buildFiles(route, parentId, folderPath);

            buildRoutes(routes, route.id, folderPath);
    });
})(routes);


// function createRouteFiles(row, outputDir, isRoot) {
//     const layoutFile = isRoot ? '+layout.svelte' : '+layout@.svelte';
//     const files = ['+layout.server.js', layoutFile, '+page.server.js', '+page.svelte'];
    
//     files.forEach(file => {
//         const filePath = path.join(outputDir, file);
//         if (!fs.existsSync(filePath)) {
//             fs.writeFileSync(filePath, '');
//         }
//     });
// }


// function buildRoutes(rows, row, parentPath) {
//     const folderName = row.route_type === 'Dynamic' ? `[${row.url_name}]` : row.url_name;
//     const outputDir = path.join(parentPath, folderName || 'root');
    
//     if (!fs.existsSync(outputDir)) {
//         fs.mkdirSync(outputDir, { recursive: true });
//     }
    
//     createRouteFiles(row, outputDir, row.parent_id === null);
    
//     rows.filter(child => child.parent_id === row.id)
//         .forEach(child => buildRoutes(rows, child, outputDir));
// }

// routes.filter(row => row.parent_id === null)
//       .forEach(rootRow => buildRoutes(routes, rootRow, 'sveltekit-adapter/routes'));


