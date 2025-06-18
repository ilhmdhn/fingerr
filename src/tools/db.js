const { getDb } = require('./data');
module.exports = () => {
    const db = getDb();
    return {
        user: db.user,
        password: db.pass,
        database: db.db,
        server: db.ip,
        connectionTimeout: 3000,
        options: {
            encrypt: false,
            tdsVersion: '7_1',
            trustServerCertificate: false
        }
    };
};