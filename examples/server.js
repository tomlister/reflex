var reflex = require("../")

let server = new reflex.Server("Lamp")

let status = false

server.start((client) => {
    client.event.on("lamp_status", (data) => {
        if (data["action"] == 'get') {
            if (status) {
                client.send("lamp_status", "on")
            } else {
                client.send("lamp_status", "off")
            }
        }
    })
    client.event.on("lamp_toggle", () => {
        status = !status
        //run toggle code
    })
})