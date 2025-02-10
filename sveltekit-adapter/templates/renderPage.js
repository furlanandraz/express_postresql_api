export default function renderPage(route) {

   

    let rendering;
    switch (route.render_method) {
        case 'SSG':
            rendering = "export const prerender = true;\n\n";
            break;
        case 'SSR':
            rendering = "export const prerender = false;\n";
            break;
    }
    const content = `${rendering}\n`;

    return content;
};