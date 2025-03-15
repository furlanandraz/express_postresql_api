import config from "./config.js";
import Client from '#DAO/Client.js';
export default async function renderPage(route) { 
    
    // const res = await fetch(`${config.apiURL}/page-build?id=${route.id}`);
    // const data = await res.json();

    const data = await Client.pageBuild(route.id);
    
    if (!Object.entries(data).length) return '';

    let imports, segments = '';
    
    if (Object.values(data.template).length) {

        const templates = new Set(Object.values(data.template));
        imports = [...templates].reduce((acc, template) => 
        acc += `import ${template.url_name.replace('.svelte', '')} from '$templates/${template.url_name}';\n`, 
        ''
        );

        segments = Object.entries(data.template).map(([key, value]) => {
        const componentName = value.url_name.replace('.svelte', '');
        return `<${componentName} data={data.props[${key}].json_data} />`;
        }).join('\n');
        
    };
    
    return `    
    <script>
        ${imports}
        let {data} = $props();
    </script>

    ${segments}`;
};