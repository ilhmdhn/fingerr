module.exports = () => {
    // const db = getDbNormal();
    return {
        // user: db.user,
        // password: db.pass,
        // database: db.db,
        // server: db.ip,
        // options: {
        //     encrypt: false,
        //     tdsVersion: '7_1',
        //     trustServerCertificate: false
        // }
        user: 'sa',
        password: '123',
        database: 'HP112',
        server: '127.0.0.1',
        options: {
            encrypt: false,
            tdsVersion: '7_1',
            trustServerCertificate: false
        }
    };
};