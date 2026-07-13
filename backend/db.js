const client = String(process.env.DB_CLIENT || process.env.DATABASE_CLIENT || 'sqlite').trim().toLowerCase();

if (client === 'mssql' || client === 'sqlserver' || client === 'sql-server') {
  module.exports = require('./db-mssql');
} else {
  module.exports = require('./db-sqlite');
}
