package producer

import (
	"os"

	"github.com/segmentio/kafka-go"
)

func CreateProducer() *kafka.Writer {
	w := &kafka.Writer{
		Addr:                   kafka.TCP(":9092"),
		Topic:                  os.Getenv("TOPIC"),
		AllowAutoTopicCreation: true,
	}

	return w
}
