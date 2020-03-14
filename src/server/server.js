const mdns = require('mdns')
const WebSocket = require('ws');
const EventEmitter = require('events');

class ReflexEmitter extends EventEmitter {}

class ThinClient {
    constructor() {
    }

    send(event, data) {
        this.ws.send(JSON.stringify({"event": event, "data": data}))
    }
}

class Server {
    constructor(deviceName = "device", roomName = "", onNewEvent) {
        this.deviceName = deviceName
        this.roomName = deviceName
    }

    _reflexWebSocketSendInternal(ws, data) {
        ws.send(JSON.stringify({
            "event":"internal",
            "data": data
        }));
    }

    _reflexStartWebSocketServer(onWebSocket) {
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', function connection(ws) {
            let client = new ThinClient();
            client.event = new ReflexEmitter();
            const deviceInfo = {
                deviceName: this.deviceName,
                roomName: this.roomName
            }
            //this._reflexWebSocketSendInternal(ws, deviceInfo);
            client.ws = ws;
            client.ws.on('open', function open() {
                client.ws.send(JSON.stringify({
                    "event":"internal",
                    "data": deviceInfo
                }));
            });
            client.ws.on('message', function incoming(data) {
                const dataobj = JSON.parse(data)
                if (dataobj["event"] == "internal") {
                    console.log("Internal Message: "+dataobj["data"])
                } else {
                    client.event.emit(dataobj["event"], dataobj["data"])
                }
            });
            onWebSocket(client)
        });
    }

    _reflexAdvertise(ad) {
        try {
            ad.on('error', this._reflexAdvertiseHandleError);
            ad.start();
        } catch (err) {
            this._reflexAdvertiseHandleError(err);
        }
    }

    _reflexAdvertiseHandleError(error) {
        switch (error.errorCode) {
            case mdns.kDNSServiceErr_Unknown:
                console.warn(error);
                setTimeout(this._reflexAdvertise, 3000);
                break;
            default:
                throw error;
        } 
    }

    start(onWebSocket) {
        //start websocket server
        this._reflexStartWebSocketServer(onWebSocket)
        /**
         * full user guide http://agnat.github.io/node_mdns/user_guide.html
         */
        //txt_record is max 512 bytes
        var txt_record = {
            reflex: true,
            name: this.deviceName,
        };
        let ad = mdns.createAdvertisement(mdns.tcp('ws'), 8080, {txtRecord: txt_record});
        //start advertising device over multicast
        this._reflexAdvertise(ad)
    }
}
module.exports = Server