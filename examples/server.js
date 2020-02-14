var reflex = require("../")

let server = new reflex.Server("Lamp")

let status = "off"

server.start((ws) => {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send(JSON.stringify({status: status}));
})