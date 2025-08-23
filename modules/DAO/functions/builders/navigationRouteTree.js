export default function navigationRouteTree(items, parentId = null) {
    return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
            id: item.id,
            parent_id: item.parent_id,
            children: navigationRouteTree(items, item.id),
        }));
}