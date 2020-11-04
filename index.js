const EventEmitter = require('events');
const fs = require('fs');
const ioctl = require('ioctl');
const ffi = require('ffi-napi');
const child_process = require('child_process');

const ref = require('ref-napi');
const array = require('ref-array-napi');
const struct = require('ref-struct-napi');
const union = require('ref-union-napi');

const Types = require('./types');
const { builtinModules } = require('module');
const { runInThisContext } = require('vm');
const types = new Types;

class Tun extends EventEmitter {
    constructor(ifname, ifaddr, prefixlen) {
        super();

        this.ifname = ifname;
        this.ifaddr = ifaddr;
        this.prefixlen = prefixlen;
    };

    open() {
        var fd = fs.openSync('/dev/net/tun', 'r+');
    
        var ifr = new types.ifreq();
        ifr.ref().fill(0);
    
        ifr.ifr_ifru.ifru_flags = types.IFF_TUN | types.IFF_NO_PI;
        ifr.ifrn_name.buffer.write(this.ifname);
    
        ioctl(fd, types.TUNSETIFF, ifr.ref());
        
        var current = ffi.Library(null, {
            socket: ['int', ['int', 'int', 'int']],
        })
        
        // TODO: pass parameters
        // TODO: check parameters
        child_process.execSync('/bin/ip addr add dev lowpan0 cccc::1/64');
        
        var sock_fd = current.socket(types.AF_PACKET, types.SOCK_RAW, types.IPPROTO_RAW);
        
        // up
        ioctl(sock_fd, types.SIOCGIFFLAGS, ifr.ref());
        
        ifr.ifr_ifru.ifru_flags |= types.IFF_UP
        ioctl(sock_fd, types.SIOCSIFFLAGS, ifr.ref());
        
        this.writeStream = fs.createWriteStream(null, {fd: fd});
        
        var readStream = fs.createReadStream(null, {fd: fd});

        readStream.on('data', (e) => {
            this.emit('data', e);
        })
    };

    send(buf) {
        this.writeStream.write(Buffer.from(buf))
    };

}

module.exports = Tun;