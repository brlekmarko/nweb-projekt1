const { Client } = require("pg");

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "bazepodataka",
    database: "nweb-projekt1",
});

module.exports = { client };