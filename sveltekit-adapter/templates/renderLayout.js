import config from "./config.js";
import Client from '#DAO/Client.js';
export default async function renderLayout(route) { 
    
    // const res = await fetch(`${config.apiURL}/layout-build?id=${route.id}`);
    // const data = await res.json();

    const data = await Client.layoutBuild(route.id);

    let imports = '';

    route.parent_id !== null ? imports += `import Breadcrumbs from '$layouts/Breadcrumbs.svelte'` : '';

    data?.layout?.url_name ? imports += `\n\t\t\timport ${data.layout.url_name.replace('.svelte', '')} from '$layouts/${data.layout.url_name}';\n` : `;\n`;
      
    return `    
        ${imports ? `
        <script>
            ${imports}
            let {children, data} = $props();
        </script>` : ''}

        <svelte:head>
            ${route.title ? `<title>${route.title}</title>` : ''}
            ${route.meta_description ? `<meta name="description" content="${route.meta_description}" />` : ''}
            ${route.meta_keywords ? `<meta name="keywords" content="${route.meta_keywords}" />` : ''}
        </svelte:head>

        ${route.parent_id !== null ? '<Breadcrumbs data={data.breadcrumbs} />' : ''}

        ${data?.layout?.url_name ? `<${data.layout.url_name.replace('.svelte', '')} {data} {children} />` : '{@render children ()}'}
        `; 

};
