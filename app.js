const express = require('express');
const pool = require('./db'); // Import the pool
const app = express();

app.get('/data', async (req, res) => {
  console.group('Database Query');
  console.time('Query Time');

  let conn;
  try {
    conn = await pool.getConnection();
    console.assert(conn, 'Failed to obtain a database connection');

    const rows = await conn.query('SELECT current_timestamp()');
    console.table(rows);

    res.json(rows);
  } catch (err) {
    console.error('Error executing query');
    console.trace(err);
    res.status(500).send('Database query error');
  } finally {
    if (conn) conn.release(); // Release the connection back to the pool
    console.timeEnd('Query Time');
    console.groupEnd();
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});