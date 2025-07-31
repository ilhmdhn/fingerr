const dgram = require('dgram');
const net = require('net');

const sendSignal = (message) => {
    const client = dgram.createSocket('udp4'); // BUAT socket baru
    client.send(message, 6543, '127.0.0.1', (err) => {
        if (err) {
            // console.error('Gagal mengirim pesan:', err);
        } else {
            // console.log('Pesan terkirim' + message);
        }
        client.close();
    });

    const clientSocket = new net.Socket();
    clientSocket.connect(6543, '127.0.0.1', () => {
        clientSocket.write(message);
        clientSocket.end();
    });

    clientSocket.on('error', (err) => {
        console.error(`Terjadi error: ${err.message}`);
    });
};

module.exports = sendSignal;
