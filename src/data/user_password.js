const db = require('../tools/db');
const sql = require('mssql');
const decrypt = require('../tools/decrypt');

const getPasswordUser = async (userId, levelUser) => {
    try {
        const query = `
            SELECT
                User_Id,
                [Level_User],
                User_Password
            FROM
                IHP_User
        `;
        const dbConfig = db();
        await sql.connect(dbConfig);
        const result = await sql.query(query);
        for (const data of result.recordset) {
            if (userId === decrypt(data.User_Id)) {
                return decrypt(data.User_Password)
            }
        }
        return false;
    } catch (error) {
        console.log('Error ' + error);
        return false;
    }
}

module.exports = getPasswordUser;