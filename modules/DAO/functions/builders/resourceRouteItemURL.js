import RouteItem from '#DAO/resource/RouteItem.js';
import Language from '#DAO/primitive/settings/Language.js';
import pgError2HttpStatus from '#DAO/functions/formatters/pgError2HttpStatus.js';

export default async function resourceRouteItemURL(id) {

    let result = [];

    try {
        // get routes
        const routes = await RouteItem.select();
        if (routes.error) return routes;

        // get enabled languages
        const languages = await Language.select({ is_enabled: true });
        if (languages.error) return languages;

        for (const language of languages.rows) {
            const language_code = language.code;
            const languageRoutes = routes.rows.filter(r => r.language_code === language_code);

            result.push(...buildPathAndBreadcrumbs(language_code, id, languageRoutes));
        }
    } catch (error) {
        return pgError2HttpStatus(error, 'builders/navigationRouteBuildURL()');
    }

    return result;
}

function buildPathAndBreadcrumbs(language_code, targetId, languageRoutes) {
    const items = languageRoutes.reduce((acc, cur) => {
        acc[cur.id] = cur;
        return acc;
    }, {});

    const result = [];

    for (const id in items) {
        const row = items[id];

        if (targetId && row.id !== targetId) continue;

        const breadcrumbs = [];
        let current = row;
        const ancestors = [];

        while (current) {
            ancestors.unshift(current);
            current = items[current.parent_id];
        }

        const slugParts = [];
        for (const ancestor of ancestors) {
            if (ancestor.slug) slugParts.push(ancestor.slug);

            breadcrumbs.push({
                label: ancestor.label || '',
                path: `/${language_code}` + (slugParts.length ? '/' + slugParts.join('/') : '')
            });
        }

        const path = breadcrumbs[breadcrumbs.length - 1].path;

        result.push({
            route_id: row.id,
            language_code,
            path,
            breadcrumbs
        });
    }

    return result;
}

