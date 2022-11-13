package consumer

import (
	"github.com/segmentio/kafka-go"
)

func CreateConsumer() *kafka.Reader {
	conf := kafka.ReaderConfig{
		Brokers:  []string{":9092"},
		Topic:    "orders",
		GroupID:  "g1",
		MaxBytes: 10,
	}

	reader := kafka.NewReader(conf)

	return reader
}
