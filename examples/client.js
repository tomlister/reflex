var reflex = require("../")

let client = new reflex.Client()

function subscriptionHandler(ws) {
    ws.on('open', function open() {
    });
    ws.on('message', function incoming(data) {
        console.log(data);
    });
}

client.discover((device) => {
    const discoveredDevice = device
    discoveredDevice.subscribe(subscriptionHandler)
    console.log("Subscribed to "+device.deviceName+".")
})