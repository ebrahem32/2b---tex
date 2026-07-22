const client = String(process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'sqlite').trim().toLowerCase();
const isMssql = client === 'mssql' || client === 'sqlserver' || client === 'sql-server';
const adapter = isMssql ? require('./db-mssql') : require('./db-sqlite');

adapter.DB_CLIENT = isMssql ? 'mssql' : 'sqlite';
adapter.IS_FILE_DATABASE = !isMssql;

module.exports = adapter;
