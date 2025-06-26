
export default async function executeQuery({query, params = [], customError = 'Internal database error.'}) {
    try {
      const result = await god.query(query, params);
      return { rows: result.rows };
    } catch (error) {
      console.error('DB error:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      return { error: customError };
    }
};
  