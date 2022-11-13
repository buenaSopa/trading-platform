const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: '*'}});

let Kafka = require('node-rdkafka');
const { json } = require('express');

// docker run -p 3000:3000 --network="host" node-server

let stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': ':9092'
}, {}, {
    topic: 'orders'
})

io.getUniqueID = () => {
    return uuidv4()
}

let i = 0

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on("message", (msg) => {
        
        obj = JSON.parse(msg)
        obj.id = i
        i+=1

        console.log(`Attempt to queue order id: ${obj.id}`)

        var queueSuccess = stream.write(Buffer.from(JSON.stringify(obj)))

        if (queueSuccess) {
            console.log("Successfully queued order id: "+ JSON.stringify(obj))
        } else {
            console.log("Fail to queue  order id: "+ obj)
        }
        
    })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});