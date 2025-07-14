const pgErrorMap = {
    '23505': { status: 409, error: 'Duplicate key value violates unique constraint' }, // unique_violation
    '23503': { status: 409, error: 'Foreign key constraint violation' }, // foreign_key_violation
    '23502': { status: 400, error: 'Not null violation' }, // not_null_violation
    '22P02': { status: 400, error: 'Invalid text representation (e.g., invalid integer)' }, // invalid_text_representation
    '42703': { status: 400, error: 'Undefined column in query' }, // undefined_column
    '42P01': { status: 500, error: 'Undefined table' }, // undefined_table
    '42601': { status: 500, error: 'Syntax error in SQL query' }, // syntax_error
    '42883': { status: 400, error: 'Undefined function' }, // undefined_function
    'P0001': { status: 422, error: 'Business rule violation' }, // custom exception via RAISE
    '40001': { status: 503, error: 'Serialization failure (deadlock or concurrency)' }, // serialization_failure
    '25P02': { status: 500, error: 'Current transaction is aborted, commands ignored' }, // in_failed_sql_transaction
  };
  
  function pgError2HttpStatus(pgError, method = 'Unknown', details = {}) {
    const mapped = pgErrorMap[pgError.code] || {
      status: 500,
      error: 'Unhandled database error',
    };
  
    return {
      error: mapped.error,
      status: mapped.status,
      details: {
        method,
        ...details
      }
    };
  }
  
  export default pgError2HttpStatus;
  