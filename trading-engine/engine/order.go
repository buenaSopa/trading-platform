package engine

import (
	"encoding/json"
	"fmt"
)

//constant
var orderType = [3]string{"limit", "market", "stop"}

type Order struct {
	Amount uint64 `json:"amount"`
	Price  uint64 `json:"price"`
	ID     uint64 `json:"id"`
	Side   int8   `json:"side"`
	Type   int8   `json:"type"`
}

func (order Order) String() string {
	return fmt.Sprintf("{ID:%d, Amount:%d, Price:%d, Type:%s} ", order.ID, order.Amount, order.Price, orderType[order.Type])
}

func (order *Order) FromJSON(msg []byte) error {
	return json.Unmarshal(msg, order)
}

func (order *Order) ToJSON() []byte {
	str, _ := json.Marshal(order)
	return str
}
