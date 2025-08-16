const pgErrorMap = {
  '23505': { status: 409, error: 'Duplicate key value violates unique constraint' },
  '23503': { status: 409, error: 'Foreign key constraint violation' },
  '23502': { status: 400, error: 'Not null violation' },
  '22P02': { status: 400, error: 'Invalid text representation (e.g., invalid integer)' },
  '42703': { status: 400, error: 'Undefined column in query' },
  '42P01': { status: 500, error: 'Undefined table' },
  '42601': { status: 500, error: 'Syntax error in SQL query' },
  '42883': { status: 400, error: 'Undefined function' },
  'P0001': { status: 422, error: 'Business rule violation' },
  '40001': { status: 503, error: 'Serialization failure (deadlock or concurrency)' },
  '25P02': { status: 500, error: 'Current transaction is aborted, commands ignored' },
};

const nodeErrorMap = {
  ECONNREFUSED: { status: 503, error: 'Database connection refused' },
  ENOTFOUND: { status: 503, error: 'Database host not found' },
  ETIMEDOUT: { status: 504, error: 'Database connection timed out' },
};

function pgError2HttpStatus(error, method = 'Unknown', details = {}) {
  if (error?.code && (pgErrorMap[error.code] || nodeErrorMap[error.code])) {
    const mapped = pgErrorMap[error.code] || nodeErrorMap[error.code];

    return {
      status: mapped.status,
      error: mapped.error,
      details: {
        method,
        full: error,
        ...details
      }
    };
  }


  return {
    error: error.message || 'Unhandled error',
    details: {
      method
    }
  };
}

export default pgError2HttpStatus;
