import pg from "pg";

const pool = new pg.Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

pool.connect((err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Connected to database: ${client.database}`);
  }
});

export default pool;
