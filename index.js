const EventEmitter = require('events');
const fs = require('fs');
const ioctl = require('ioctl');
const ffi = require('ffi-napi');

const Types = require('./types');
const types = new Types;

const TUN_PATH = "/dev/net/tun"

class Tun extends EventEmitter {
    constructor(ifname, ifaddr, prefixlen) {
        super();

        // TODO: check parameters ?
        this.ifname = ifname;
        this.ifaddr = ifaddr;
        this.prefixlen = prefixlen;
    };

    open() {
        var fd = fs.openSync(TUN_PATH, 'r+');
    
        var ifr = new types.ifreq();
        ifr.ref().fill(0);
    
        ifr.ifr_ifru.ifru_flags = types.IFF_TUN | types.IFF_NO_PI;
        ifr.ifrn_name.buffer.write(this.ifname);
    
        ioctl(fd, types.TUNSETIFF, ifr.ref());
        
        var current = ffi.Library(null, {
            socket: ['int', ['int', 'int', 'int']],
        })
        
        // TODO: check parameters
        
        // use this socket for controlling linux by ioctl
        var sock_fd = current.socket(types.AF_INET6, types.SOCK_DGRAM, 0);
        this.sock_fd = sock_fd
        // get interface index
        ifr.ref().fill(0);
        ifr.ifrn_name.buffer.write(this.ifname);
        ioctl(sock_fd, types.SIOCGIFINDEX, ifr.ref());
        
        var if_index = ifr.ifr_ifru.ifru_ivalue;
        this.if_index = if_index
        //console.log(" int id=", if_index);
        
        this.setAddress(this.ifaddr, this.prefixlen)

        // up
        // get flags
        ifr.ref().fill(0);
        ifr.ifrn_name.buffer.write(this.ifname);
        ioctl(sock_fd, types.SIOCGIFFLAGS, ifr.ref());
        
        // set up flag
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

    setAddress(ifaddr, prefixlen){
        // set address
        // TODO: pass parameters
        var ifr6 = new types.ifreq6();
        ifr6.ref().fill(0);
        ifr6.ifindex = this.if_index;
        ifr6.prefixlen = prefixlen;
        for (let i = 0; i < 16; i++) {
            ifr6.address[i] = ifaddr[i]
        }
        ioctl(this.sock_fd, types.SIOCSIFADDR, ifr6.ref());
    }

}

module.exports = Tun;