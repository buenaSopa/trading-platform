package engine

import (
	"encoding/json"
	"fmt"
)

type Trade struct {
	TakerOrderID uint64 `json:"taker_order_id"`
	MakerOrderID uint64 `json:"maker_order_id"`
	Amount       uint64 `json:"amount"`
	Price        uint64 `json:"price"`
}

func (trade *Trade) FromJSON(msg []byte) error {
	return json.Unmarshal(msg, trade)
}

func (trade Trade) String() string {
	return fmt.Sprintf("{TakerOrderID:%d, MakerOrderID:%d, Amount:%d, Price:%d} ", trade.TakerOrderID, trade.MakerOrderID, trade.Amount, trade.Price)
}

func (trade *Trade) ToJSON() []byte {
	str, _ := json.Marshal(trade)
	return str
}
