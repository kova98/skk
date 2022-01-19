const knex = require("knex");

const conn = knex({
    client: 'better-sqlite3', // or 'better-sqlite3'
    connection: {
      filename: "skk.sqlite3"
    }
  });

module.exports = conn;