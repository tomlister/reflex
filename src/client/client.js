const mdns = require('mdns')
const WebSocket = require('ws');
const EventEmitter = require('events');

class ReflexEmitter extends EventEmitter {}

class Device {
    constructor(deviceName, host, addresses, port) {
        this.deviceName = deviceName
        this.host = host
        this.addresses = addresses
        this.port = port
    }

    subscribe(callback) {
        this.event = new ReflexEmitter();
        this.ws = new WebSocket('ws://'+this.host+':'+this.port);
        const that = this;
        this.ws.on('open', function open() {
            callback()
        });
        this.ws.on('message', function incoming(data) {
            const dataobj = JSON.parse(data)
            if (dataobj["event"] == "internal") {
                console.log("Internal Message: "+dataobj["data"])
            } else {
                that.event.emit(dataobj["event"], dataobj["data"])
            }
        });
    }

    send(event, data) {
        this.ws.send(JSON.stringify({"event": event, "data": data}))
    }
}

class Client {
    constructor() {
    }
    discover(onDiscover) {
        let devicesSeen = []
        let browser = mdns.createBrowser(mdns.tcp('ws'));
        browser.on('serviceUp', function(service) {
            if (!devicesSeen.includes(service.name)) {
                devicesSeen.push(service.name)
                if(service.txtRecord['reflex'] === 'true') {
                    let tmpdevice = new Device(service.txtRecord['name'], service.host, service.addresses, service.port)
                    onDiscover(tmpdevice)
                }
            }
        });
        browser.on('serviceDown', function(service) {
            //TODO: Tear down any subscribed devices.
            devicesSeen = devicesSeen.filter(e => ![service.name].includes(e));
        });
        browser.start();
    }
}
module.exports = Client