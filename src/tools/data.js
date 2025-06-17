const Store = require('electron-store');

const getDb = () =>{
    const newStore = new Store();
    const ip = newStore.get('ip');
    const user = newStore.get('user');
    const pass = newStore.get('pass');
    const db = newStore.get('db');
    return {
        ip: ip,
        user: user,
        pass: pass,
        db: db,
    }
}

const setDb = (ip, user, pass, db) =>{
    const newStore = new Store();
    newStore.set('ip', ip);
    newStore.set('user', user);
    newStore.set('pass', pass);
    newStore.set('db', db);
}

module.exports = {
    getDb,
    setDb
}