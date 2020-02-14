const mdns = require('mdns')
const WebSocket = require('ws');

class Server {
    constructor(deviceName = "device", onNewEvent) {
        this.deviceName = deviceName
    }

    _reflexStartWebSocketServer(onWebSocket) {
        const wss = new WebSocket.Server({ port: 8080 });

        wss.on('connection', function connection(ws) {
            onWebSocket(ws)
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