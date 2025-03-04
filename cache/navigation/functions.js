export function buildMenuTree(items, parentId = null) {
    return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
            ...item,
            children: buildMenuTree(items, item.id),
        }));
}

