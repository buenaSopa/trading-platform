package engine

// Process an order and return the trades generated before adding the remaining amount to the market
func (book *OrderBook) Process(order Order) []Trade {
	if order.Side == 1 {
		return book.processLimitBuy(order)
	}
	return book.processLimitSell(order)
}

// Process a limit buy order
func (book *OrderBook) processLimitBuy(order Order) []Trade {
	// fmt.Println("point 1")
	trades := make([]Trade, 0, 1)
	n := len(book.SellOrders)
	// check if we have at least one matching order
	// if there is orders in sellOrders[] AND buy order price is bigger or equal than the smallest price in the sellOrders[]
	if n != 0 && book.SellOrders[n-1].Price <= order.Price {
		// fmt.Println("point 2")
		// traverse all orders that match
		// given a scenario, 100 $15 buy order will fill 10 $13 sell order, 30 $14 sell order and 60 $15 sell order
		for i := n - 1; i >= 0; i-- {
			sellOrder := book.SellOrders[i]
			if sellOrder.Price > order.Price {
				break
			}
			// fmt.Println("i: ", i)
			// fill the entire order
			if sellOrder.Amount >= order.Amount {
				// fmt.Println("point 3")
				// fmt.Println("before: ", sellOrder)
				trades = append(trades, Trade{order.ID, sellOrder.ID, order.Amount, sellOrder.Price})
				sellOrder.Amount -= order.Amount
				// fmt.Println("after: ", sellOrder)
				book.SellOrders[i] = sellOrder
				if sellOrder.Amount == 0 {
					// fmt.Println("point 5")
					book.removeSellOrder(i)
				}
				return trades
			}
			// fill a partial order and continue
			if sellOrder.Amount < order.Amount {
				// fmt.Println("point 4")
				trades = append(trades, Trade{order.ID, sellOrder.ID, sellOrder.Amount, sellOrder.Price})
				order.Amount -= sellOrder.Amount
				book.removeSellOrder(i)
				continue
			}
		}
	}
	// finally add the remaining order to the list
	book.addBuyOrder(order)
	return trades
}

// Process a limit sell order
func (book *OrderBook) processLimitSell(order Order) []Trade {
	trades := make([]Trade, 0, 1)
	n := len(book.BuyOrders)
	// check if we have at least one matching order
	// if there is orders in buyOrders[] AND sell order price is smaller or equal than the biggest price in the buyOrders[]
	if n != 0 && book.BuyOrders[n-1].Price >= order.Price {
		// traverse all orders that match
		for i := n - 1; i >= 0; i-- {
			// := initialise not point to
			buyOrder := book.BuyOrders[i]
			if buyOrder.Price < order.Price {
				break
			}
			// fill the entire order
			if buyOrder.Amount >= order.Amount {
				trades = append(trades, Trade{order.ID, buyOrder.ID, order.Amount, buyOrder.Price})
				buyOrder.Amount -= order.Amount
				book.BuyOrders[i] = buyOrder
				if buyOrder.Amount == 0 {
					book.removeBuyOrder(i)
				}
				return trades
			}
			// fill a partial order and continue
			if buyOrder.Amount < order.Amount {
				trades = append(trades, Trade{order.ID, buyOrder.ID, buyOrder.Amount, buyOrder.Price})
				order.Amount -= buyOrder.Amount
				book.removeBuyOrder(i)
				continue
			}
		}
	}
	// finally add the remaining order to the list
	book.addSellOrder(order)
	return trades
}
