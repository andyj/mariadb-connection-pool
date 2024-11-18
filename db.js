const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',      // Change to your database host
  user: 'db_user',        // Your database user
  password: 'db_password',// Your database password
  database: 'my_database',// Your database name
  connectionLimit: 10     // Maximum number of connections in the pool
});

module.exports = pool;