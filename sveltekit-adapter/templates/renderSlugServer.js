export default function renderSlugServer(route) {
    return `
    export async function load() {
        const res = await fetch('http://localhost:8000/db/v1/presentation/get-route-layout?id=${route.id}');
    
        if (res.ok) {
            const data = await res.json();
            return data;
        } else {
            return null;
        }
    }`;
};