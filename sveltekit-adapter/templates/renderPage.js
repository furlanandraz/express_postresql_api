import Client from '#DAO/Client.js';
export default async function renderPage(route) { 
    
    const data = await Client.pageBuild(route.id);
    
    if (!Object.entries(data).length) return null;

    let imports, segments = '';
    
    if (Object.values(data.template).length) {

        const templates = new Set(Object.values(data.template));
        imports = [...templates].reduce((acc, template) => 
        acc += `import ${template.url_name.replace('.svelte', '')} from '$templates/${template.url_name}';\n`, 
        ''
        );

        segments = Object.entries(data.template).map(([key, value]) => {
        const componentName = value.url_name.replace('.svelte', '');
        return `<${componentName} data={data[${key}].json_data} />`;
        }).join('\n');
        
    };
    
    return `    
    <script>
        ${imports}
        let {data} = $props();
    </script>

    ${segments}`;
};