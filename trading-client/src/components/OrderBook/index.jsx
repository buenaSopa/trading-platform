import {React, useEffect, useState} from 'react';
import './index.css'

const sellOrder = [
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
    [
        8000,
        29000,
        134000
    ],
]

const buyOrder = [
    [
        9000,
        37000,
        100000
    ],
]

const sideIds = {
    0: "sell",
    1: "buy"
}

const OrderList = ({list, side}) => (
    list.map(item => (
        <div className='flex shrink text-xs text-center grow'>
            <p className={`grow ${sideIds[side]}`}>{item[0]}</p>
            <p className=' grow'>{item[1]}</p>
            <p className=' grow'>{item[2]}</p>
        </div>

    ))
);

const OrderBook = () => {
    const [buyOrders, setBuyOrders] = useState([]);
    const [sellOrders, setsellOrders] = useState([]);


    return (
        <div className='main-book border-2 border-gray-600 flex flex-col '>
            <h1 className='p1-2 text-xs text-center'>Order Book</h1>
            <div className='grow'>

                <div className='flex font-black shrink text-xs text-center grow'>
                    <p className='grow'>PRICE</p>
                    <p className='grow'>QUANTITY</p>
                    <p className='grow'>TOTAL</p>
                </div>

                <div className='slice bg-black flex flex-col'>
                    <OrderList list={sellOrder.slice(0,8)} side={0} />
                </div>

                <div className='text-center text-xs'>Spread</div>

                <div className='slice bg-black'>
                    <OrderList list={buyOrder.slice(0,8)} side={1} />
                </div>

            </div>
        </div>
    );
};

export default OrderBook;