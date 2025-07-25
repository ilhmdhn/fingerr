const Store = require('electron-store');
const store = new Store();

const getDb = () => {
    return {
        ip: store.get('ip'),
        user: store.get('user'),
        pass: store.get('pass'),
        db: store.get('db')
    };
};

const setDb = (ip, user, pass, db) => {
    store.set('ip', ip);
    store.set('user', user);
    store.set('pass', pass);
    store.set('db', db);
};

module.exports = {
    getDb,
    setDb
};
