package producer

import (
	"github.com/segmentio/kafka-go"
)

func CreateProducer(topic string) *kafka.Writer {
	w := &kafka.Writer{
		Addr:  kafka.TCP(":9092"),
		Topic: topic,
	}

	return w
}
