const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: '*'}});

let Kafka = require('node-rdkafka');


io.getUniqueID = () => {
    return uuidv4()
}

// docker run -p 3000:3000 --network="host" node-server

const client = Kafka.AdminClient.create({
    'client.id': 'kafka-admin',
    'metadata.broker.list': ':9092'
});

client.createTopic({
    topic: 'trades',
    num_partitions: 1,
    replication_factor: 1
}, function(err) {
});

const streamProducer = Kafka.Producer.createWriteStream({
    'metadata.broker.list': ':9092'
}, {}, {
    topic: 'orders'
})

const streamConsumer = Kafka.KafkaConsumer.createReadStream({
    'group.id': 'kafka',
    'metadata.broker.list': ':9092'
}, {}, {
    topics: ['trades']
});

let i = 0
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.join("clients")

    // sent orders info from client to engine
    socket.on("orders", (msg) => {
        obj = JSON.parse(msg)
        obj.id = i
        i+=1

        var queueSuccess = streamProducer.write(Buffer.from(JSON.stringify(obj)))
        if (queueSuccess) {
            console.log("Successfully queued order: "+ JSON.stringify(obj))
        } else {
            console.log("Fail to queue  order: "+ obj)
        }
    })
});

// sent trades info from engine to client
streamConsumer.on('data', function(message) {
    console.log('trades: ', message.value.toString());
    io.to("clients").emit("trades", message.value.toString())
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});