import config from "./config.js";
export default function renderSlugServer() {
    return `
    export async function load({url, fetch}) {
        const fullUrl = encodeURIComponent(url.pathname);
        const res = await fetch(\`${config.apiURL}/topic-data?url=\${fullUrl}\`);
    
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            return null;
        }
    }`;
};