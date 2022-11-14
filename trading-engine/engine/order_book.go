package engine

// OrderBook type
type OrderBook struct {
	BuyOrders  []Order
	SellOrders []Order
}

// Add a buy order to the order book
func (book *OrderBook) addBuyOrder(order Order) {
	n := len(book.BuyOrders)
	var pos int

	//always add market order at the end
	if order.Type == 1 {
		for i := n - 1; i >= 0; i-- {
			buyOrder := book.BuyOrders[i]
			if buyOrder.Type != 1 {
				pos = i + 1
				break
			}
		}
	} else {
		for i := n - 1; i >= 0; i-- {
			// The order of the buy order in BuyOrders[] is ascending price, descending id so that the order that is the same price but
			// queue earlier wil get process first, first come first serve.
			buyOrder := book.BuyOrders[i]
			pos = i
			if buyOrder.Price < order.Price && buyOrder.Type != 1 {
				pos = i + 1
				break
			}
		}
	}
	if n == 0 {
		// if BuyOrders[] is empty, straight append
		book.BuyOrders = append(book.BuyOrders, order)
	} else {
		// else increase the size of BuyOrders[] using append. If order {position: element} is insert 2:e,
		// [0:a, 1:b, 2:c, 3:d] -> [0:a, 1:b, 2:c, 3:d, 4:e], and copy, [0:a, 1:b, 2:c, 3:d, 4:e] -> [0:a, 1:b, 2:e, 3:c, 4:d] 5:e
		// 5:e will be deleted
		book.BuyOrders = append(book.BuyOrders, order)
		copy(book.BuyOrders[pos+1:], book.BuyOrders[pos:])
		book.BuyOrders[pos] = order
	}
}

func (book *OrderBook) addSellOrder(order Order) {
	n := len(book.SellOrders)
	var pos int

	if order.Type == 1 {
		for i := n - 1; i >= 0; i-- {
			sellOrder := book.SellOrders[i]
			if sellOrder.Type != 1 {
				pos = i + 1
				break
			}
		}
	} else {
		// Order is descending price, descending id, first come first serve.
		for i := n - 1; i >= 0; i-- {
			sellOrder := book.SellOrders[i]
			pos = i
			if sellOrder.Price > order.Price && sellOrder.Type != 1 {
				pos = i + 1
				break
			}
		}
	}
	if n == 0 {
		book.SellOrders = append(book.SellOrders, order)
	} else {
		book.SellOrders = append(book.SellOrders, order)
		copy(book.SellOrders[pos+1:], book.SellOrders[pos:])
		book.SellOrders[pos] = order
	}
}

// Remove a buy order from the order book at a given index
func (book *OrderBook) removeBuyOrder(index int) {
	book.BuyOrders = append(book.BuyOrders[:index], book.BuyOrders[index+1:]...)
}

// Remove a sell order from the order book at a given index
func (book *OrderBook) removeSellOrder(index int) {
	book.SellOrders = append(book.SellOrders[:index], book.SellOrders[index+1:]...)
}
