const venom = require("venom-bot")

venom.create({
    session : "innovatech",
    multidevice: true
})
.then((client) => start(client))
.catch((error) => console.log(error));

const start = (client) => {
    client.onMessage((message) => (
        console.log(message)
    ))
}