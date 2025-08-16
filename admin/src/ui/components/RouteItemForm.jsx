import { useRef, useState } from "react";
import clsx from "clsx";
import styles from "./RouteItemForm.module.css";


export default function RouteItemForm({ item = null, languageEnabled = [], editRouteitemHasChildren = false, parentId = 1, onSubmit}) {
  const [isActive, setActive] = useState("general");
    const formRef = useRef(null);
    

  function onSerializeAndUpdate(e) {
    e.preventDefault();
    const fd = new FormData(formRef.current);
    const raw = formDataToNestedObject(fd);

    const payload = {
      ...(item ? {id: strToNumOrNull(raw.id)} : {}),
      parent_id: strToNumOrNull(raw.parent_id),
      render_type: raw.render_type ?? "page",
      render_method: raw.render_method ?? "SSR",
      ...(item ? {prev_id: strToNumOrNull(raw.prev_id)} : {}),
      ...(item ? {next_id: strToNumOrNull(raw.next_id)}: {}),
      route_translation: Array.isArray(raw.route_translation)
        ? raw.route_translation.map(t => ({
            language_code: t.language_code,
            label: (t.label ?? "").trim(),
            slug: (t.slug ?? "").trim(),
            title: (t.title ?? "").trim(),
            meta_description: (t.meta_description ?? "").trim(),
            meta_keywords: (t.meta_keywords ?? "").trim(),
          }))
        : [],
      };
      
      console.log(payload)

    onSubmit(payload);
  }

  return (
    <>
      <nav className={styles.tabList}>
        <button
          type="button"
          className={clsx(styles.tab, isActive === "general" && styles.tabActive)}
          onClick={() => setActive("general")}
        >
          General
        </button>

        {languageEnabled.map(lang => (
          <button
            type="button"
            key={lang}
            className={clsx(styles.tab, isActive === lang && styles.tabActive)}
            onClick={() => setActive(lang)}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </nav>

      <form
        ref={formRef}
        className={styles.form}
        onSubmit={onSerializeAndUpdate}
        // key is optional but helps reset defaultValues when switching items
        key={`${item?.id ?? "new"}-${languageEnabled.length}`}
      >
        {/* GENERAL */}
        <section
          className={clsx(styles.panel, isActive !== "general" && styles.panelHidden)}
          aria-hidden={isActive !== "general"}
        >
          {item && <input type="hidden" name="id" defaultValue={item.id} />}

          <input type="hidden" name="parent_id" defaultValue={item?.parent_id ?? parentId} />
          <input type="hidden" name="prev_id"   defaultValue={item?.prev_id ?? ""} />
          <input type="hidden" name="next_id"   defaultValue={item?.next_id ?? ""} />

          <label className={styles.field}>
            <span>Render Type</span>
                      <select disabled={item && editRouteitemHasChildren} name="render_type" defaultValue={item?.render_type ?? "page"}>
              <option value="page">Page</option>
              <option value="topic">Topic</option>
            </select>
          </label>

          <label className={styles.field}>
            <span>Render Method</span>
            <select name="render_method" defaultValue={item?.render_method ?? "SSR"}>
              <option value="SSR">SSR</option>
              <option value="CSR">CSR</option>
              <option value="SSG">SSG</option>
            </select>
          </label>
        </section>

        {/* TRANSLATIONS */}
        {languageEnabled.map((lang, i) => {
          const rt = item?.route_translation?.find(tr => tr.language_code === lang);
          return (
            <section
              key={lang}
              className={clsx(styles.panel, isActive !== lang && styles.panelHidden)}
              aria-hidden={isActive !== lang}
            >
              <input
                type="hidden"
                name={`route_translation[${i}][language_code]`}
                defaultValue={lang}
              />

              <label className={styles.field}>
                <span>Label</span>
                <input
                  name={`route_translation[${i}][label]`}
                  defaultValue={rt?.label ?? ""}
                />
              </label>

              <label className={styles.field}>
                <span>Slug</span>
                <input
                  name={`route_translation[${i}][slug]`}
                  defaultValue={rt?.slug ?? ""}
                />
              </label>

              <label className={styles.field}>
                <span>Title</span>
                <input
                  name={`route_translation[${i}][title]`}
                  defaultValue={rt?.title ?? ""}
                />
              </label>

              <label className={styles.field}>
                <span>Meta Description</span>
                <textarea
                  name={`route_translation[${i}][meta_description]`}
                  defaultValue={rt?.meta_description ?? ""}
                />
              </label>

              <label className={styles.field}>
                <span>Meta Keywords</span>
                <input
                  name={`route_translation[${i}][meta_keywords]`}
                  defaultValue={rt?.meta_keywords ?? ""}
                />
              </label>
            </section>
          );
        })}

        <div className={styles.actions}>
          <button type="submit">Save</button>
        </div>
      </form>
    </>
  );
}

/* ---------- helpers ---------- */

// Turn FormData with bracketed names into a nested object
function formDataToNestedObject(fd) {
  const out = {};
  for (const [name, value] of fd.entries()) {
    const keys = [];
    // split "route_translation[0][slug]" -> ["route_translation","0","slug"]
    name.replace(/\[(.*?)\]|([^[\].]+)/g, (_, b, p) => keys.push(b ?? p));

    let cur = out;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      const nextK = keys[i + 1];
      if (!(k in cur)) cur[k] = /^\d+$/.test(nextK) ? [] : {};
      cur = cur[k];
    }
    const last = keys[keys.length - 1];
    if (Array.isArray(cur)) {
      cur[Number(last)] = value;
    } else {
      cur[last] = value;
    }
  }
  return out;
}

function strToNumOrNull(v) {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}
