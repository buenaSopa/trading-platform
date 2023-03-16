# trading-platform (in-progress)
A small scaled trading platform simulator containing trading engine and client interface.

## Techstack
### trading engine
- Golang
- Kafka-go

### trading server
- Nodejs
- Websocket

### client interface
- AnyStock
- React js
- Tailwindcss
- Kafka js

### Architechture
<!-- - Microservices with kafka -->
- Event driven

### Improvement
- replace websocket connection to rpc and sse
- redesign the orderbook return from matching engine to client
- integrate some sort of db (cassandra)

## Design
![image](https://user-images.githubusercontent.com/59494865/225617769-0bca3772-d149-4e6f-a2df-1443b66c9ea2.png)

## Client Interface
![image](https://user-images.githubusercontent.com/59494865/225611040-6cf73f9b-e982-4380-bcd9-be07a020cdef.png)



