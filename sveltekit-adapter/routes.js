import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// import { god } from '#DAO/clients/index.js';
import Build from '#DAO/adapter/Build.js';
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

async function buildRoutes(data, outputDir) {
    const { language_default, language_enabled, route_tree } = data;

     for (const lang of language_enabled) {
    const baseDir = lang === language_default
      ? outputDir
      : path.join(outputDir, lang);

    fs.mkdirSync(baseDir, { recursive: true });
    await buildRoutesForLang(route_tree, lang, language_default, baseDir);
  }
}

async function buildRoutesForLang(nodes, lang, defaultLang, baseDir) {
  for (const node of nodes) {
    const slug = pickSlug(node, lang, defaultLang);
    const currentDir = slug ? path.join(baseDir, slug) : baseDir;

    fs.mkdirSync(currentDir, { recursive: true });

    if (Array.isArray(node.children) && node.children.length) {
      await buildRoutesForLang(node.children, lang, defaultLang, currentDir);
    }
  }
}

function pickSlug(node, lang, defaultLang) {
  const byLang = node.route_translation?.find(t => t.language_code === lang);
  if (byLang && typeof byLang.slug === 'string') return byLang.slug;

  const byDefault = node.route_translation?.find(t => t.language_code === defaultLang);
  return byDefault?.slug ?? '';
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
        // const { rows: routes } = await god.query("SELECT * FROM navigation.route ORDER BY id;");
        const data = await Build.navigation();
        // can be replaced with Navigation.getRouteItems();
        
        const success = await buildRoutes(data, outputDir);
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
        // cleanup(outputDir);
        process.exit(0);
    }
    
})();


