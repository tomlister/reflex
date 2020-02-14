const mdns = require('mdns')
const WebSocket = require('ws');

class Device {
    constructor(deviceName, host, addresses, port) {
        this.deviceName = deviceName
        this.host = host
        this.addresses = addresses
        this.port = port
    }

    subscribe(callback) {
        this.ws = new WebSocket('ws://'+this.host+':'+this.port);
        callback(this.ws)
    }
}

class Client {
    constructor() {
    }
    discover(onDiscover) {
        let devicesSeen = []
        let browser = mdns.createBrowser(mdns.tcp('ws'));
        browser.on('serviceUp', function(service) {
            if (!devicesSeen.includes(service.host)) {
                devicesSeen.push(service.host)
                if(service.txtRecord['reflex'] === 'true') {
                    let tmpdevice = new Device(service.txtRecord['name'], service.host, service.addresses, service.port)
                    onDiscover(tmpdevice)
                }
            }
        });
        browser.on('serviceDown', function(service) {
            //TODO: Tear down any subscribed devices.
        });
        browser.start();
    }
}
module.exports = Client