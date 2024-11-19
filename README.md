
# Mariadb Connection Pools In Node
## Optimizing MariaDB Performance in Node.js Applications

Read the full post here:
[Optimizing MariaDB Performance in Node.js Applications](https://www.andyjarrett.com/posts/2024/connection-pools-in-node-with-mariadb/)

### Why Use a Connection Pool?

Database connection pooling is critical for your web applications. Without a pool, every database query spins up a new connection, which can quickly exhaust your resources! A connection pool maintains a stash of open connections ready to use, reducing overhead and boosting performance.

This project also provided an opportunity to revisit and improve some of my older code by incorporating [console methods for debugging](https://www.andyjarrett.com/posts/2024/utility-console-methods-for-debugging-workflow/) that I’ve covered [recently](https://www.andyjarrett.com/posts/2024/advanced-javascript-console-methods/).

### Benefits of Connection Pooling

- **Reduced Latency**: Reusing connections eliminates the time spent establishing new ones.
- **Better Resource Management**: Limits the number of simultaneous connections, keeping your database stable.
- **Improved Scalability**: Handle more users without compromising performance.

### Installation

To get started, install the necessary dependencies:

```bash
npm install mariadb dotenv
```

### Setting Up the Connection Pool

Create a `db.js` file to configure the connection pool:

```javascript
require('dotenv').config(); // Load environment variables

const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 10 // Adjust based on your application's needs
});

module.exports = pool;
```

### Using the Pool in Your Application

Here’s an example of how to use the connection pool in an Express route:

```javascript
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
```

### Best Practices

- **Monitor Pool Usage**: Adjust `connectionLimit` based on your application’s traffic and database capacity.
- **Use Timeouts Wisely**: Set reasonable timeouts for idle connections and query execution to optimize resource usage.
- **Leverage Cloud Tools**: Use AWS CloudWatch (or equivalent) to monitor performance and tweak your configurations.

### Example Configuration for AWS RDS

For those deploying on AWS RDS, here are example settings for two different instance types:

#### **db.t3.micro** (Entry-Level Instance)

```javascript
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 5,
  acquireTimeout: 10000,
  idleTimeout: 30000,
  connectTimeout: 10000,
});
```

#### **db.m6g.large** (Production-Level Instance)

```javascript
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 20,
  acquireTimeout: 20000,
  idleTimeout: 60000,
  queueLimit: 30,
  connectTimeout: 15000,
});
```

### License

This project is licensed under the [MIT License](LICENSE).
