import RouteItem from '#DAO/resource/RouteItem.js';
import Language from '#DAO/primitive/settings/Language.js';
import pgError2HttpStatus from '#DAO/functions/formatters/pgError2HttpStatus.js';

export default async function resourceRouteItemTree(simple = false) {

  try {

    // get routes
    const routes = simple ? await RouteItem.selectSimple() :  await RouteItem.select();
    if (routes.error) return routes;
    
    
    // get enabled languages
    const languages = await Language.select({ is_enabled: true });
    if (languages.error) return languages;
    
    const languageDefault = languages.rows.find(lang => lang.is_default)?.code ?? null;
    if (simple) return {
      language_default: languageDefault,
      language_enabled: languages.rows.map(l => l.code),
      route_tree: [buildRouteItemTreeSimple(routes.rows).at(0)]
    };
    return {
      language_default: languageDefault,
      language_enabled: languages.rows.map(l => l.code),
      route_tree: [buildRouteItemTree(languages, routes.rows).at(0)]
    };

  } catch (error) {
      console.error(error);
      return pgError2HttpStatus(error, 'builders/resourceRouteItemTree()');
  }
}


function buildRouteItemTreeSimple(routes, parentId = null) {
  // Step 1: Group translations by route id
  const nodeMap = new Map();

  for (const item of routes) {
    nodeMap.set(item.id, {
      ...item,
      children: []
    });
  }


  // Step 2: Extract children of current parent
  const children = Array.from(nodeMap.values()).filter(
    node => node.parent_id === parentId
  );

  // Step 3: Order children using prev_id / next_id chain
  const ordered = [];
  const lookup = new Map(children.map(child => [child.id, child]));
  const seen = new Set();

  // Find starting node (first in chain)
  let current = children.find(child => !child.prev_id || !lookup.has(child.prev_id));
  while (current && !seen.has(current.id)) {
    ordered.push(current);
    seen.add(current.id);
    current = current.next_id ? lookup.get(current.next_id) : null;
  }

  // Optional: append broken/missing routes not in chain
  for (const child of children) {
    if (!seen.has(child.id)) {
      ordered.push(child);
    }
  }

  // Step 4: Recursively build children
  return ordered.map(child => ({
    ...child,
    children: buildRouteItemTreeSimple(routes, child.id)
  }));
}

function buildRouteItemTree(languages, routes, parentId = null) {
  // Step 1: Group translations by route id
  const nodeMap = new Map();

  for (const item of routes) {
    if (!nodeMap.has(item.id)) {
      nodeMap.set(item.id, {
        id: item.id,
        parent_id: item.parent_id,
        render_type: item.render_type,
        render_method: item.render_method,
        prev_id: item.prev_id,
        next_id: item.next_id,
        route_translation: [],
        children: []
      });
    }
    nodeMap.get(item.id).route_translation.push({
      route_id: item.id,
      language_code: item.language_code,
      label: item.label,
      title: item.title,
      slug: item.slug,
      meta_description: item.meta_description,
      meta_keywords: item.meta_keywords
    });
  }

  // Step 2: Extract children of current parent
  const children = Array.from(nodeMap.values()).filter(
    node => node.parent_id === parentId
  );

  // Step 3: Order children using prev_id / next_id chain
  const ordered = [];
  const lookup = new Map(children.map(child => [child.id, child]));
  const seen = new Set();

  // Find starting node (first in chain)
  let current = children.find(child => !child.prev_id || !lookup.has(child.prev_id));
  while (current && !seen.has(current.id)) {
    ordered.push(current);
    seen.add(current.id);
    current = current.next_id ? lookup.get(current.next_id) : null;
  }

  // Optional: append broken/missing routes not in chain
  for (const child of children) {
    if (!seen.has(child.id)) {
      ordered.push(child);
    }
  }

  // Step 4: Recursively build children
  return ordered.map(child => ({
    ...child,
    children: buildRouteItemTree(languages, routes, child.id)
  }));
}

