export function buildRouteURL(items, parentId = null, parentPath = '', URLs = [], breadcrumbs = []) {
    
    items
        .filter(item => item.parent_id === parentId)
        .forEach(item => {

            const fullUrl = parentId === null
                ? ''
                : `${parentPath}/${item.slug}`;
            
            const fullBreadcrumbs = [
                ...breadcrumbs,
                {
                    title: item.title,
                    url: fullUrl || '/'
                }
            ];

            URLs.push({
                route_id: item.id,
                url_uuid: item.url_uuid,
                full_url: fullUrl,
                route_url: item.slug,
                breadcrumbs: fullBreadcrumbs
            });
            buildRouteURL(items, item.id, fullUrl, URLs, fullBreadcrumbs);
        });
    return URLs;
}

export function buildTopicURL(routeURLs, topicItems) {
    return topicItems.map(topic => {
        const route = routeURLs.find(route => route.route_id === topic.route_id);
        return {
            route_id: topic.route_id,
            topic_id: topic.id,
            url_uuid: topic.url_uuid,
            full_url: `${route.full_url}/${topic.slug}`,
            topic_url: topic.slug,
            breadcrumbs: [
                ...route.breadcrumbs,
                {
                    title: topic.title,
                    url: `${route.full_url}/${topic.slug}`
                }
            ]
            
        };
    });
}

export function buildRouteTree(items, parentId = null) {
    return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
            ...item,
            children: buildRouteTree(items, item.id),
        }));
}




