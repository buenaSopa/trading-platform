package producer

import (
	"github.com/segmentio/kafka-go"
)

func CreateProducer() *kafka.Writer {
	w := &kafka.Writer{
		Addr:                   kafka.TCP(":9092"),
		Topic:                  "trades",
		AllowAutoTopicCreation: true,
	}

	return w
}
