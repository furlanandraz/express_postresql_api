export function arrayOfObjectsToVALUES(arrayOfObjects) {
    
    if (!Array.isArray(arrayOfObjects) || arrayOfObjects.length === 0) {
        return { error: "Invalid input: Expected a non-empty array of objects" };
    }

    const stdEntryL = Object.entries(arrayOfObjects[0]).length;

    const result = arrayOfObjects.reduce((allRows, row) => {
        if (Object.entries(row).length !== stdEntryL) {
            throw new Error("Object dimension conformity check failed");
        }

        const values = Object.values(row)
            .map(value => {
                if (value === null) return "NULL";
                if (typeof (value) === 'boolean') return value ? "TRUE" : "FALSE";
                if (typeof (value) === 'string') return `'${value}'`;
                if (typeof (value) === 'array' || 'object') return `'${JSON.stringify(value)}'`;
                return value;
            })
            .join(', ');

        return allRows + `(${values}), `;
    }, '').slice(0, -2);

    return result;
}

