var reflex = require("../")

let client = new reflex.Client()

client.discover((device) => {
    const discoveredDevice = device
    discoveredDevice.subscribe(()=>{
        /* Lamp Status */
        discoveredDevice.event.on("lamp_status", (data) => {
            console.log(data)
        })
        discoveredDevice.send("lamp_status", {"action": "get"})
        discoveredDevice.send("lamp_toggle", {})
        discoveredDevice.send("lamp_status", {"action": "get"})
        console.log("Subscribed to "+device.deviceName+".")
    })
})