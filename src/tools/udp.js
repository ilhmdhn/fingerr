const dgram = require('dgram');

const sendSignal = (message) => {
    const client = dgram.createSocket('udp4'); // BUAT socket baru
    client.send(message, 6543, '127.0.0.1', (err) => {
        if (err) {
            // console.error('Gagal mengirim pesan:', err);
        } else {
            // console.log('Pesan terkirim');
        }
        client.close();
    });
};

module.exports = sendSignal;
