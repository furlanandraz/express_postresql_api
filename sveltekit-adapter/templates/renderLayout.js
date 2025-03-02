import Presentation from '#DAO/Presentation.js';
export default async function renderLayout(route) { 
    
    const data = await Presentation.setClient('god').getRouteLayoutById(route.id);

    if (!data) return null;

    const imports = `import ${data.url_name.replace('.svelte', '')} from '$layouts/${data.url_name}';\n`;
      
    return `    
    <script>
        ${imports}

        let {children, data} = $props();
    </script>

    <${data.url_name.replace('.svelte', '')} {children} />`;
};