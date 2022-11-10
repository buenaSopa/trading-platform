import React from 'react';
import { useState } from 'react';
import "./index.css"
import { numberWithCommas } from '../../myLib';
import { socket } from '../../App';

const sideIds = {
    0: "sell",
    1: "buy"
}

let accountCash = 102000


const Box = ({side}) => {
    const [orderType, setOrderType] = useState('limit')
    const [price, setPrice] = useState('')
    const [amount, setAmount] = useState('')
    
    const handleSubmit = (e) => {
        e.preventDefault()

        //publish to kafka producer component
        console.log({side, orderType, price, amount})

        socket.emit("message", `Order: ${side} ${orderType} ${price} ${amount} `)
    }

    return (
        <div className='border-2 rounded-lg flex flex-col border-gray-300 box p-3 h-fit m-5'>
            <form className='space-y-3'
                onSubmit={handleSubmit}
            >

                <div className=" flex ">
                    Available: {numberWithCommas(accountCash)} USD
                </div>

                <div className=" flex-row flex gap-4 ">
                    <label>Order Type</label>
                    <select 
                        value={orderType}
                        onChange={(e)=> setOrderType(e.target.value)}
                    >
                        <option value="limit">Limit Order</option>
                        <option value="market">Market Order</option>
                        <option value="stop">Stop Order</option>
                    </select>
                </div>

                <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
                    <h3 className='py-2 pl-3 pr-9'>Price</h3>
                    <input 
                        type="number"
                        className="text-slate-50 w-full pl-2 bg-transparent " 
                        placeholder="100.00" 
                        value={price}
                        onChange={(e)=> setPrice(e.target.value)}
                        required
                    />
                    <h3 className='py-2 px-3 right-0 '>USD</h3>
                </div>
                <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
                    <h3 className='py-2 px-3 '>Amount</h3>
                    <input 
                        type="number"
                        className="text-slate-50 w-full  pl-2 bg-transparent " 
                        placeholder="10,000.00"
                        value={amount} 
                        onChange={(e)=> setAmount(e.target.value)}
                        required
                    />
                    <h3 className='py-2 px-3 right-0 '>GOOG</h3>
                </div>
                <div className=' flex'>
                    <button className={side === 1 ? 'buy-button btn' : 'sell-button btn'}>{sideIds[side]}</button>
                </div>

            </form>
        </div>
        )
    }

const OrderBox = () => {
    return (
        <div className='main-box flex flex-row border-2 border-gray-600'>   
            <Box side={1}/>
            <Box side={0}/>
        </div>
    );
};

export default OrderBox;