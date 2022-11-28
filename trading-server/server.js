const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: {origin: '*'}});
const Kafka = require('node-rdkafka');
// docker run -p 3000:3000 --network="host" node-server

let state = {};

class ConsumerFactory {
    create = (topicList, groupId, port) => {
        let consumer

        consumer = Kafka.KafkaConsumer.createReadStream({
            'group.id': groupId,
            'metadata.broker.list': port,
            // 'allow.auto.create.topics': true
        }, {}, {
            topics: topicList
        });

        return consumer
    }
}

const topicList = ['trades', 'buyOrderBook','sellOrderBook', 'orders']
const createTopics = (admin, topicList) => {
    for(const topic of topicList){
        admin.createTopic({
            topic: topic,
            num_partitions: 1,
            replication_factor: 1
        }, function(err) {
        });
    }
}

// const deleteTopicList = ['orders', '__consumer_offsets']
// const deleteTopics = (admin, topicList) => {
//     for(const topic of topicList){
//         admin.deleteTopic(topic);
//     }
// }
// deleteTopics(client, deleteTopicList)

const init = () => {
    const topicFactory = new ConsumerFactory()
    const tradeConsumer = topicFactory.create(['trades'], 'tradesConsumer', ':9092')
    const buyOrderBookConsumer = topicFactory.create(['buyOrderBook'], 'buyOrderBookConsumer', ':9092')
    const sellOrderBookConsumer = topicFactory.create(['sellOrderBook'], 'sellOrderBookConsumer', ':9092')
    
    tradeConsumer.on('data', function(message) {
        console.log('trades: ', message.value.toString());
        state['trades'] = message.value.toString()
        io.to("clients").emit("trades", state['trades'])
    });
    
    buyOrderBookConsumer.on('data', (message)=>{
        console.log('BuyOrderBook: ',message.value.toString())
        state['buyOrderBook'] = message.value.toString()
        io.to("clients").emit("buyOrderBook", state['buyOrderBook'])
    })
    
    sellOrderBookConsumer.on('data', (message)=>{
        console.log('SellOrderBook: ', message.value.toString())
        state['sellOrderBook'] = message.value.toString()
        io.to("clients").emit("sellOrderBook", state['sellOrderBook'])
    })
}

const client = Kafka.AdminClient.create({
    'client.id': 'kafka-admin',
    'metadata.broker.list': ':9092'
});


createTopics(client, topicList)

// using streaming api as oppose to standard api, standard api is more performance however it requires more manual set up
const streamProducer = Kafka.Producer.createWriteStream({
    'metadata.broker.list': ':9092'
}, {}, {
    topic: 'orders'
})

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
            console.log("Queue is fulled")
        }
    })
});

setTimeout(() => {
    init()
}, 1500);



server.listen(3000, () => {
  console.log('listening on *:3000');
});