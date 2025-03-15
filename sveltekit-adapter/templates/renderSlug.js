import config from "./config.js";
import Client from '#DAO/Client.js';
export default async function renderSlug(route) { 
    
    // const res = await fetch(`${config.apiURL}/topic-build?id=${route.id}`);
    // const data = await res.json();

    const data = await Client.topicBuild(route.id);

    if (!Object.entries(data).length) return null;

    let imports = '';

    route.parent_id !== null ? imports += `import Breadcrumbs from '$layouts/Breadcrumbs.svelte'` : '';

    imports += `\n\t\timport ${data.layout.url_name.replace('.svelte', '')} from '$layouts/${data.layout.url_name}';\n`;
      
    return `    
    <script>
        ${imports}

        let {data, children} = $props();
    </script>

    <Breadcrumbs data={data.breadcrumbs} />

    <${data.layout.url_name.replace('.svelte', '')} {data} {children}/>`;
};