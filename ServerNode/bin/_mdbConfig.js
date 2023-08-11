var mdb = require('mariadb');

// Connection to MariaDB
var mariaPool = mdb.createPool({
  host:     process.env.DATABASE_HOST,
  port:     process.env.DATABASE_PORT,
  user:     process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 5
});

module.exports = Object.freeze({
  pool: mariaPool
});