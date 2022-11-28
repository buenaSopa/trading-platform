package main

import (
	"context"
	"encoding/json"
	"exchange/consumer"
	"exchange/engine"
	"exchange/producer"
	"fmt"

	"github.com/segmentio/kafka-go"
)

var orderSide = [2]string{"sell", "buy"}

func main() {

	conn, err := kafka.DialLeader(context.Background(), "tcp", ":9092", "trades", 0)
	if err != nil {
		panic(err.Error())
	}
	defer conn.Close()

	consumer := consumer.CreateConsumer()

	tradeProducer := producer.CreateProducer("trades")
	buyOrderBookProducer := producer.CreateProducer("buyOrderBook")
	sellOrderBookProducer := producer.CreateProducer("sellOrderBook")

	// create the order book
	book := engine.OrderBook{
		BuyOrders:  make([]engine.Order, 0, 100),
		SellOrders: make([]engine.Order, 0, 100),
	}

	// create a signal channel to know when we are done

	for {
		fmt.Println("got it")

		msg, err := consumer.ReadMessage(context.Background())
		if err != nil {
			fmt.Println(err)
			continue
		}
		var order engine.Order

		order.FromJSON(msg.Value)

		trades := book.Process(order)

		fmt.Println("order in: ", order, " ", orderSide[order.Side], " side")

		fmt.Println("buyOrder: ", book.BuyOrders)
		fmt.Println("sellOrder: ", book.SellOrders)
		fmt.Println("tradeOrder: ", trades)
		fmt.Println("--")

		rawBuyOrderBook, _ := json.Marshal(book.BuyOrders)
		buyOrderBookProducer.WriteMessages(context.Background(), kafka.Message{Value: []byte(rawBuyOrderBook)})

		rawSellOrderBook, _ := json.Marshal(book.SellOrders)
		sellOrderBookProducer.WriteMessages(context.Background(), kafka.Message{Value: []byte(rawSellOrderBook)})

		for _, trade := range trades {
			rawTrade := trade.ToJSON()
			ctx := context.Background()
			msg := kafka.Message{Value: []byte(rawTrade)}
			tradeProducer.WriteMessages(ctx, msg)
		}
	}
}
