const { exit } = require('process');
const Tun = require('./index');

var tun = new Tun('lowpan0', 'cccc::1', 64);
try {
    tun.open();
}
catch (err) {
    console.log("erro deu ", err);
    process.exit(1);
}


tun.on('data', (e) => {
//    console.log('rx:', e);

    if (e[6] == 0x3a && e[40] == 128 && e[41] == 0) {
//        console.log('icmp echo');

        // muda para reply
        e[40] = 129;

        // recalcula checksum
        e[42] = e[42] - 1;
        if (e[42] == 0xff) {
            e[43] = e[43] - 1;
        }

        // inverte o src com dst
        for (var i = 0; i < 16; i++) {
            var tmp = e[8+i];
            e[8+i] = e[8+i+16];
            e[8+i+16] = tmp;
        }

        tun.send(e);
    }


})