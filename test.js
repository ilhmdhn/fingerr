
const db = require('./src/tools/db');
const sql = require('mssql');

const test = async () => {
    try {
        const dbConfig = db();
        await sql.connect(dbConfig);
    } catch (error) {
    }
}

test()