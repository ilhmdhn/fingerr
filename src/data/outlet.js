const db = require('../tools/db');
const sql = require('mssql');

const getOutlet = async () => {
    try {
        const query = `
            SELECT
                Outlet
            FROM
                IHP_Config
        `;
        const dbConfig = db();
        await sql.connect(dbConfig);
        const result = await sql.query(query);
        if (result.recordset.length > 0) {
            // return result.recordset[0].Outlet;
            return 'HP000';
        } else {
            return ''
        }
    } catch (err) {
        throw `getOutlet ${err.message}`;
    }
}

getOutlet()

module.exports = getOutlet;