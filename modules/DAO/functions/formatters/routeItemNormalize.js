export default function formatRouteById(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return null;

  // shared fields (take from first row)
  const {
    id,
    parent_id,
    render_type,
    render_method,
    prev_id,
    next_id
  } = rows[0];

  // build translations from all rows (no hardcoded language codes)
  const route_translation = rows
    .filter(r => r && r.language_code) // guard
    .map(r => ({
      language_code: r.language_code,
      slug: r.slug ?? '',
      title: r.title ?? '',
      label: r.label ?? '',
      meta_description: r.meta_description ?? '',
      meta_keywords: r.meta_keywords ?? ''
    }))
    // optional: stable order by language code
        .sort((a, b) => a.language_code.localeCompare(b.language_code));

  return {
    id,
    parent_id,
    render_type,
    render_method,
    prev_id,
    next_id,
    route_translation
  };
}
