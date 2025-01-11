export function buildMenuTree(items, parentId = null) {
    console.log(items);
    return items
        .filter(item => item.parent_id === parentId)
        .map(item => ({
            ...item,
            children: buildMenuTree(items, item.id),
        }));
}

