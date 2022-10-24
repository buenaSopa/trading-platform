package consumer

import (
	"os"

	"github.com/segmentio/kafka-go"
)

func CreateConsumer() *kafka.Reader {
	conf := kafka.ReaderConfig{
		Brokers:  []string{":9092"},
		Topic:    os.Getenv("TOPIC"),
		GroupID:  "g1",
		MaxBytes: 10,
	}

	reader := kafka.NewReader(conf)

	return reader
}
