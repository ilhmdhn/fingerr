const db = require('../tools/db');
const decrypt = require('../tools/decrypt');
const sql = require('mssql');
const outlet = require('./outlet');

const getUserList = async () => {
    try {
        const query = `
            SELECT
                User_ID,
                Level_User
            FROM
                IHP_User
        `;
        const dbConfig = db();
        await sql.connect(dbConfig);
        const result = await sql.query(query);
        const outletCode = await outlet()
        if (result.recordset.length > 0) {
            const users = [];
            for (data of result.recordset) {
                users.push({
                    user: decrypt(data.User_ID),
                    level: decrypt(data.Level_User),
                    outlet: outletCode
                })
            }
            return users;
        } else {
            return []
        }

    } catch (err) {
        throw `getUserList ${err.message}`;
    }
}

module.exports = getUserList;