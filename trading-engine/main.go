package main

import (
	"context"
	"exchange/consumer"
	"exchange/engine"
	"fmt"
	"os"
)

func main() {

	os.Setenv("TOPIC", "my-topic")

	consumer := consumer.CreateConsumer()
	// producer := producer.CreateProducer()

	// create the order book
	book := engine.OrderBook{
		BuyOrders:  make([]engine.Order, 0, 100),
		SellOrders: make([]engine.Order, 0, 100),
	}

	// create a signal channel to know when we are done

	for {
		msg, err := consumer.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			continue
		}
		var order engine.Order

		order.FromJSON(msg.Value)

		trades := book.Process(order)

		fmt.Println("buyOrder: ", book.BuyOrders)
		fmt.Println("sellOrder: ", book.SellOrders)
		fmt.Println("tradeOrder: ", trades)
		fmt.Println("--")

		// fmt.Println(trades)

		// for _, trade := range trades {
		// 	rawTrade := trade.ToJSON()
		// 	ctx := context.Background()
		// 	msg := kafka.Message{Value: []byte(rawTrade)}
		// 	fmt.Println(rawTrade)
		// 	producer.WriteMessages(ctx, msg)
		// }
	}
}

// func submitOrder() {
// 	producer := producer.CreateProducer()

// 	for {
// 		var amn string
// 		ctx := context.Background()

// 		fmt.Print("Amount: ")
// 		_, err := fmt.Scan(&amn)
// 		if err != nil {
// 			log.Fatal(err)
// 		}

// 		msg := kafka.Message{
// 			Value: []byte(amn),
// 		}
// 		producer.WriteMessages(ctx, msg)
// 	}
// }

//// create the consumer and listen for new order messages
// 	consumer := createConsumer()

// 	// create the producer of trade messages
// 	producer := createProducer()

// 	// create the order book
// 	book := engine.OrderBook{
// 		BuyOrders:  make([]engine.Order, 0, 100),
// 		SellOrders: make([]engine.Order, 0, 100),
// 	}

// 	// create a signal channel to know when we are done
// 	done := make(chan bool)

// 	// start processing orders
// 	go func() {
// 		for msg := range consumer.Messages() {
// 			var order engine.Order

// 			fmt.Println(string(msg.Value))
// 			// decode the message
// 			order.FromJSON(msg.Value)
// 			// process the order
// 			trades := book.Process(order)
// 			// send trades to message queue
// 			for _, trade := range trades {
// 				rawTrade := trade.ToJSON()
// 				producer.Input() <- &sarama.ProducerMessage{
// 					Topic: "trades",
// 					Value: sarama.ByteEncoder(rawTrade),
// 				}
// 			}
// 			// mark the message as processed
// 			consumer.MarkOffset(msg, "")
// 		}
// 		done <- true
// 	}()

// 	// wait until we are done
// 	<-done
// }

// //
// // Create the consumer
// //

// func createConsumer() *cluster.Consumer {
// 	// define our configuration to the cluster
// 	config := cluster.NewConfig()
// 	config.Consumer.Return.Errors = false
// 	config.Group.Return.Notifications = false
// 	config.Consumer.Offsets.Initial = sarama.OffsetOldest

// 	// create the consumer
// 	consumer, err := cluster.NewConsumer([]string{":9092"}, "myconsumer", []string{"orders"}, config)
// 	if err != nil {
// 		log.Fatal("Unable to connect consumer to kafka cluster")
// 	}
// 	go handleErrors(consumer)
// 	go handleNotifications(consumer)

// 	return consumer
// }

// func createConsumer() {

// }

// func handleErrors(consumer *cluster.Consumer) {
// 	for err := range consumer.Errors() {
// 		log.Printf("Error: %s\n", err.Error())
// 	}
// }

// func handleNotifications(consumer *cluster.Consumer) {
// 	for ntf := range consumer.Notifications() {
// 		log.Printf("Rebalanced: %+v\n", ntf)
// 	}
// }

// //
// // Create the producer
// //

// func createProducer() sarama.AsyncProducer {
// 	config := sarama.NewConfig()
// 	config.Producer.Return.Successes = false
// 	config.Producer.Return.Errors = true
// 	config.Producer.RequiredAcks = sarama.WaitForAll
// 	producer, err := sarama.NewAsyncProducer([]string{":9092"}, config)
// 	if err != nil {
// 		log.Fatal("Unable to connect producer to kafka server")
// 	}
// 	return producer
