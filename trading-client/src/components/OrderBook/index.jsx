import {React, useEffect, useState} from 'react';
import './index.css'
import { socket } from '../../App';
import { fixedFloating } from '../../myLib';

const sideIds = {
    0: "sell",
    1: "buy"
}

const OrderList = ({list, side}) => {
    let cum = 0    

    if (side==1){
        list = list.slice(0,8)
    } else {
        list = list.slice(-8).reverse()
    }

    for (const item of list){
        cum += item[1]
        
        if (item.length >= 3) {
            item[2] = cum
        } else {
            item.push(cum)
        }
    }

    if(side==0){
        list = list.reverse()
    }
        
    return list.map(item => {
        return (
            <div className='text-xs text-center grid grid-cols-3 row-data'>
                <p className={sideIds[side]}>{item[0]}</p>
                <p>{item[1]}</p>
                <p>{item[2]}</p>
            </div>
        )
    })
};

const OrderBook = () => {
    const [buyOrders, setBuyOrders] = useState([]);
    const [sellOrders, setSellOrders] = useState([]);
    const [spread, setSpread] = useState()

    const processBook = (listOfOrder) => {
        let priceAmountList = {}
    
        //ignore market order
        for (const order of listOfOrder) {
            if (order.type != 1) {
                if (order.price in priceAmountList){
                    priceAmountList[fixedFloating(order.price)] += order.amount
                } else {
                    priceAmountList[fixedFloating(order.price)] = order.amount
                }
            }
        }

        let sortedPriceList = Object.keys(priceAmountList).map((key) => {
            return [key, priceAmountList[key]]
        })

        sortedPriceList.sort((f,s) => {
            return s[0] - f[0]
        })
        return sortedPriceList
    }

    const reconnect = () => {
        setTimeout(() => {
            if (socket) {
                console.log("orderbooks socket initialized in parent component")
                socket.on("buyOrderBook", (msg)=> {
                    let obj = JSON.parse(msg)
                    console.log("buyOrderBook received: ", obj)
                    //maybe a data tidy here or at server

                    setBuyOrders(processBook(obj))
                })
                socket.on("sellOrderBook", (msg)=> {
                    let obj = JSON.parse(msg)
                    console.log("sellOrderBook received: ", obj)
                    //maybe a data tidy here or at server

                    setSellOrders(processBook(obj))
                })

            } else {
                console.log("waiting for socket to be initialized...")
                reconnect()
            }


        }, 1000);
    }

    useEffect(() => {
        // console.log(`Orderbooks: ${JSON.stringify(sellOrders)} | ${JSON.stringify(buyOrders)} ||| ${buyOrders, sellOrders}`)
        if (buyOrders.length != 0 && sellOrders.length != 0) {
            setSpread(fixedFloating(sellOrders.slice(-1)[0][0] - buyOrders[0][0]))
        }
    }, [buyOrders, sellOrders]);

    useEffect(() => {
        reconnect()
    }, []);

    return (
        <div className='main-book border-2 border-gray-600 flex flex-col '>
            <h1 className='py-1 text-xs text-center'>Order Book</h1>
            <div className='grow'>

                <div className=' grid grid-cols-3 font-black shrink text-xs text-center my-1'>
                    <p>PRICE</p>
                    <p>QUANTITY</p>
                    <p>TOTAL</p>
                </div>

                <div className='slice'>
                    <OrderList list={sellOrders} side={0} />
                </div>

                <div className='text-xs font-bold flex items-center' style={{height:'6%'}}>
                    <p className='text-center grow'>Spread: {spread}</p>
                </div>

                <div className='slice'>
                    <OrderList list={buyOrders} side={1} />
                </div>

            </div>
        </div>
    );
};

export default OrderBook;