import Presentation from '#DAO/Presentation.js';
export default async function renderPage(route) { 
    
    const data = await Presentation.setClient('god').getPageContentById(route.id);

    if (!data) return;
    const imports = Object.values(data).reduce((acc, template) => 
        acc += `import ${template.url_name.replace('.svelte', '')} from '$templates/${template.url_name}';\n`, 
        ''
    );
    const segments = Object.entries(data).map(([key, value]) => {
        const componentName = value.url_name.replace('.svelte', '');
        return `<${componentName} data={data[${key}].segment_json} />`;
    }).join('\n');
      
    return `
    <svelte:head>
        <title>${route.ui_name}</title>
        ${route.meta_description && `<meta name="description" content="${route.meta_description}" />`}
        ${route.meta_keywords && `<meta name="keywords" content="${route.meta_keywords}" />`}
    </svelte:head>
    
    <script>
        ${imports}
        let {data} = $props();
    </script>

    ${segments}`;
};