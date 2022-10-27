import React from 'react';
import './index.css'

const sellOrder = [
    [
        9000,
        37000,
        100000
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

const sideIds = {
    0: "sell",
    1: "buy"
}

const OrderList = ({ list, side}) => (
    list.map(item => (
        <tr key={item}>
            <td className={sideIds[side]}>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]}</td>
        </tr>
    ))
);

const OrderBook = () => {
    return (
        <div className='main-book border-2 border-gray-600'>
            <h1 className='title py-4'>Order Book</h1>
            <table className='table-auto'>
                <thead className='header'>
                    <tr>
                        <th>PRICE</th>
                        <th>QUANTITY</th>
                        <th>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                <OrderList list={sellOrder} side={0} />
                
                <tr><td colSpan={3} className="spread">Spread: 5.0 (0.04%)</td></tr>

                <OrderList list={buyOrder} side={1} />
                </tbody>
            </table>
        </div>
    );
};

export default OrderBook;