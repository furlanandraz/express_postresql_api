import config from "./config.js";
export default function renderPageServer(route) {

    let rendering;

    switch (route.render_method) {
        case 'SSG':
            rendering = "export const prerender = true;";
            break;
        case 'SSR':
            rendering = "export const prerender = false;";
            break;
    }
    

    return `
    ${rendering}

    export async function load() {
        const res = await fetch('${config.apiURL}/page-data?id=${route.id}');
    
       if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            return { error: 'Failed to load data' };
        }
    }`;
};