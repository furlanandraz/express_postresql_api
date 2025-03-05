export function buildRouteURL(items, parentId = null, parentPath = '', collectedLinks = []) {
    items
        .filter(item => item.parent_id === parentId)
        .forEach(item => {
            const fullUrl = parentId === null
                ? ''
                : `${parentPath}/${item.url_name}`;

            collectedLinks.push({
                route_id: item.id,
                url_uuid: item.url_uuid,
                full_url: fullUrl,
                route_url: item.url_name
            });
            buildRouteURL(items, item.id, fullUrl, collectedLinks);
        });
    return collectedLinks;
}

export function buildTopicURL(routeLinks, topicItems) {
    return topicItems.map(topic => {
        const route = routeLinks.find(route => route.route_id === topic.route_id);
        return {
            route_id: topic.route_id,
            topic_id: topic.id,
            url_uuid: topic.url_uuid,
            full_url: `${route.full_url}/${topic.slug}`,
            topic_url: topic.slug
            
        };
    });
}


