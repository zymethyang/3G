var exec = require('child_process').exec;
var network = require('network');
const isOnline = require('is-online');
var enable = true;
var on3g = true;

setInterval(() => {
    isOnline().then(online => {
        if (online) {
            network.get_interfaces_list(function (err, obj) {
                var haveConnect = false;
                if (on3g) {
                    for (index in obj) {
                        if ((obj[index].name == 'eth0') && (obj[index].gateway_ip != null)) {
                            isOnline().then(online => {
                                if (online) {
                                    haveConnect = true;
                                }
                            })
                        }
                    }
                }
                if (haveConnect) {
                    console.log("Have connectivity");
                    if (enable) {
                        dir = exec("pm2 delete wvdial", function (err, stdout, stderr) {
                            dir = exec("/root/core/ppp-off.sh", function (err, stdout, stderr) {
                                enable = false;
                                on3g = false;
                                if (err) {
                                    // should have err.code here?  
                                }
                                //console.log(stdout);
                            });
                        });
                    }
                } else {
                    console.log("Use Dcom");
                }
            })
        } else {
            console.log("Disconnect");
            dir = exec("pm2 start wvdial -- 3gconnect", function (err, stdout, stderr) {
                enable = true;
                on3g = true;
                if (err) {
                    // should have err.code here?  
                }
                //console.log(stdout);
            });
        }
    });
}, 5000);
