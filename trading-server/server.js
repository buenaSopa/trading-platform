const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: '*'}});

let Kafka = require('node-rdkafka')

// docker run -p 3000:3000 --network="host" node-server

let stream = Kafka.Producer.createWriteStream({
    'metadata.broker.list': ':9092'
}, {}, {
    topic: 'order'
})

io.on('connection', (socket) => {
  console.log('a user connected');

    socket.on("message", (msg) => {
        console.log(`attempt to send ${msg}`)

        var queueSuccess = stream.write(Buffer.from(msg))


        if (queueSuccess) {
            console.log("Successfully queued "+ msg)
        }
        
    })

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});