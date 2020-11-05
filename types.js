var ref = require('ref-napi');
var array = require('ref-array-napi');
var struct = require('ref-struct-napi');
var union = require('ref-union-napi');

class Types {
    
    IPPROTO_IP = 0;
    IPPROTO_RAW = 255;
    
    SOCK_DGRAM = 2;
    SOCK_RAW = 2;

    AF_INET = 0x2;
    AF_INET6 = 0xA;
    AF_PACKET = 17;

    IFF_TUN = 0x0001;
    IFF_TAP = 0x0002;
    IFF_NO_PI = 0x1000;
    
    IFF_UP          = 1<<0;
    IFF_BROADCAST   = 1<<1;
    IFF_DEBUG       = 1<<2;
    IFF_LOOPBACK    = 1<<3;
    IFF_POINTOPOINT = 1<<4;
    IFF_NOTRAILERS  = 1<<5;
    IFF_RUNNING     = 1<<6;
    IFF_NOARP       = 1<<7;
    IFF_PROMISC     = 1<<8;
    IFF_ALLMULTI    = 1<<9;
    IFF_MASTER      = 1<<10;
    IFF_SLAVE       = 1<<11;
    IFF_MULTICAST   = 1<<12;
    IFF_PORTSEL     = 1<<13;
    IFF_AUTOMEDIA   = 1<<14;
    IFF_DYNAMIC     = 1<<15;
    IFF_LOWER_UP    = 1<<16;
    IFF_DORMANT     = 1<<17;
    IFF_ECHO        = 1<<18;
    
    IFNAMSIZ = 16;
    IFALIASZ = 256;
    IFHWADDRLEN = 6;
    
    TUNSETIFF = 0x400454ca;
    TUNSETPERSIST = 0x400454cb;
    
    /* Socket configuration controls. */
    SIOCGIFNAME        = 0x8910; /* get iface name */
    SIOCSIFLINK        = 0x8911; /* set iface channel */
    SIOCGIFCONF        = 0x8912; /* get iface list */
    SIOCGIFFLAGS       = 0x8913; /* get flags */
    SIOCSIFFLAGS       = 0x8914; /* set flags */
    SIOCGIFADDR        = 0x8915; /* get PA address */
    SIOCSIFADDR        = 0x8916; /* set PA address */
    SIOCGIFDSTADDR     = 0x8917; /* get remote PA address */
    SIOCSIFDSTADDR     = 0x8918; /* set remote PA address */
    SIOCGIFBRDADDR     = 0x8919; /* get broadcast PA address */
    SIOCSIFBRDADDR     = 0x891a; /* set broadcast PA address */
    SIOCGIFNETMASK     = 0x891b; /* get network PA mask */
    SIOCSIFNETMASK     = 0x891c; /* set network PA mask */
    SIOCGIFMETRIC      = 0x891d; /* get metric */
    SIOCSIFMETRIC      = 0x891e; /* set metric */
    SIOCGIFMEM         = 0x891f; /* get memory address (BSD) */
    SIOCSIFMEM         = 0x8920; /* set memory address (BSD) */
    SIOCGIFMTU         = 0x8921; /* get MTU size */
    SIOCSIFMTU         = 0x8922; /* set MTU size */
    SIOCSIFNAME        = 0x8923; /* set interface name */
    SIOCSIFHWADDR      = 0x8924; /* set hardware address */
    SIOCGIFENCAP       = 0x8925; /* get/set encapsulations */
    SIOCSIFENCAP       = 0x8926;        
    SIOCGIFHWADDR      = 0x8927; /* Get hardware address */
    SIOCGIFSLAVE       = 0x8929; /* Driver slaving support */
    SIOCSIFSLAVE       = 0x8930; 
    SIOCADDMULTI       = 0x8931; /* Multicast address lists */
    SIOCDELMULTI       = 0x8932; 
    SIOCGIFINDEX       = 0x8933; /* name -> if_index mapping */
    SIOCSIFPFLAGS      = 0x8934; /* set/get extended flags set */
    SIOCGIFPFLAGS      = 0x8935; 
    SIOCDIFADDR        = 0x8936; /* delete PA address */
    SIOCSIFHWBROADCAST = 0x8937; /* set hardware broadcast addr */
    SIOCGIFCOUNT       = 0x8938; /* get number of devices */
    
    sockaddr = struct({
        sa_family : ref.types.uint16,
        sa_data : array(ref.types.char, 14)
    });
    
    sockaddr_in = struct( {
        sin_family : ref.types.short,
        sin_port : ref.types.ushort,
        sin_addr : ref.types.uint,
        sin_zero : array(ref.types.char, 8)
    });
    
    sockaddr_in6 = struct( {
        sin6_family : ref.types.short,
        sin6_port : ref.types.ushort,
        sin6_flowinfo : ref.types.uint,
        sin6_addr : array(ref.types.uchar, 16)
    });

    // not strictly standard, but it matches how it's packed
    sockaddr_union = union({
        sockaddr : this.sockaddr,
        sockaddr_in : this.sockaddr_in,
    });
    
    ifmap = struct({
        mem_start : ref.types.long,
        mem_end : ref.types.long,
        base_addr : ref.types.short,
        irq : ref.types.short,
        dma : ref.types.char,
        port : ref.types.char
    });
    
    raw_hdlc_proto = struct({
        encoding : ref.types.short,
        parity : ref.types.short
    });
    
    cisco_proto = struct({
        interval : ref.types.int,
        timeout : ref.types.int
    });
    
    fr_proto = struct({
        t391 : ref.types.uint,
        t392 : ref.types.uint,
        n391 : ref.types.uint,
        n392 : ref.types.uint,
        n393 : ref.types.uint,
        lmi : ref.types.ushort,
        dce: ref.types.ushort
    });
    
    fr_proto_pvc = struct({
        dlci : ref.types.uint
    });
    
    fr_proto_pvc_info = struct({
        dlci : ref.types.uint,
        master : array(ref.types.char, this.IFNAMSIZ)
    });
    
    sync_serial_settings = struct({
        clock_rate : ref.types.uint,
        clock_type : ref.types.uint,
        loopback : ref.types.ushort
    });
    
    te1_settings = struct({
        clock_rate : ref.types.uint,
        clock_type : ref.types.uint,
        loopback : ref.types.ushort,
        slot_map : ref.types.uint
    });
    
    ifsettings = struct({
        type : ref.types.int,
        size : ref.types.int,
        ifs_ifsu : union({
            raw_hdlc : ref.refType(this.raw_hdlc_proto),
            cisco : ref.refType(this.cisco_proto),
            fr : ref.refType(this.fr_proto),
            fr_pvc : ref.refType(this.fr_proto_pvc),
            fr_pvc_info : ref.refType(this.fr_proto_pvc_info),
            sync : ref.refType(this.sync_serial_settings),
            te1 : ref.refType(this.te1_settings)
        })
    });
    
    ifrn_name = array(ref.types.char, this.IFNAMSIZ);
    
    ifr_ifru = union({
        ifru_addr : this.sockaddr_union,
        ifru_dstaddr : this.sockaddr_union,
        ifru_broadaddr : this.sockaddr_union,
        ifru_netmask : this.sockaddr_union,
        ifru_hwaddr : this.sockaddr_union,
        ifru_flags : ref.types.short,
        ifru_ivalue : ref.types.int,
        ifru_mtu : ref.types.int,
        ifru_map : this.ifmap,
        ifru_slave : array(ref.types.char, this.IFNAMSIZ),
        ifru_newname : array(ref.types.char, this.IFNAMSIZ),
        ifru_data : ref.refType(ref.types.void),
        ifru_settings : this.ifsettings
    });
    
    ifreq = struct({
        ifrn_name : this.ifrn_name,
        ifr_ifru : this.ifr_ifru
    });

    ifreq6 = struct({
        address : array(ref.types.uchar, 16),
        prefixlen : ref.types.uint32,
        ifindex : ref.types.uint

    })
}

module.exports = Types;