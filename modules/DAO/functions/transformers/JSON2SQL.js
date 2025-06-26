
export default function JSON2SQL({ input, allow = [] }) {
    // 1) Normalize to an array of rows
    const rows = Array.isArray(input) ? input : [input];
  
    // 2) Must be non-empty
    if (rows.length === 0) {
        return { error: 'Invalid input: expected a non-empty object or array of objects' };
    }
  
    // 3) Strip out omitted keys and validate each is a plain object
    const clean = rows.map((obj, i) => {
        if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
            throw new Error(`Invalid element at index ${i}: not a plain object`);
        }
        // strip omitted keys
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            if (allow.includes(k)) out[k] = v;
        }
        return out;
    });
  
    // 4) Now extract columns from the *first* cleaned row
    const cols = Object.keys(clean[0]);
    if (cols.length === 0) {
        return { error: 'Invalid input: object must have at least one property after omissions' };
    }
  
    // 5) Ensure every row has exactly the same keys
    clean.forEach((row, i) => {
        const rowKeys = Object.keys(row);
        if (
            rowKeys.length !== cols.length ||
            !cols.every(c => rowKeys.includes(c))
        ) {
            throw new Error(`Row key mismatch at index ${i}`);
        }
    });

    const columns = `(${cols.join(', ')})`;

    const values = clean
        .map(row => {
            const vs = cols
                .map(key => {
                    const v = row[key];
                    if (v === null) return 'NULL';
                    if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
                    if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
                    if (Array.isArray(v) || typeof v === 'object') {
                        return `'${JSON.stringify(v)}'`;
                    }
                    return v;
                })
                .join(', ');
            return `(${vs})`;
        })
        .join(', ');
  
    return [columns, values];
}
  