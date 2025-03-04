export function buildRouteLink(items, parentId = null, parentPath = '', collectedLinks = []) {
    items
        .filter(item => item.parent_id === parentId)
        .forEach(item => {
            // Generate the full URL properly
            const fullUrl = parentId === null 
                ? ''  // Root URL remains empty
                : `${parentPath}/${item.url_name}`.replace('//', '/'); // Prevent double slashes

            // Push the generated link to the flat array
            collectedLinks.push({
                route_id: item.id,
                url_uuid: item.url_uuid,
                full_url: fullUrl === '' ? null : fullUrl,
                route_url: item.url_name
            });

            // Recursively process children while passing the collected array
            buildRouteLink(items, item.id, fullUrl, collectedLinks);
        });

    return collectedLinks;
}

export function buildTopicLink(routeLinks, topicItems) {
    return topicItems.map(topic => {
        // Find the corresponding route object by `route_id`
        const route = routeLinks.find(route => route.route_id === topic.route_id);

        return {
            route_id: topic.route_id,
            topic_id: topic.id,
            url_uuid: topic.url_uuid,
            full_url: `${route.full_url}/${topic.slug}`,
            topic_slug: topic.slug
            
        };
    });
}


