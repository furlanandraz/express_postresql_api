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
        const res = await fetch('http://localhost:8000/db/v1/presentation/get-page-content?id=${route.id}');
    
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            return null;
        }
    }`;
};