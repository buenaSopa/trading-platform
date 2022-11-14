import React from 'react';
import { useState } from 'react';
import "./index.css"
import { numberWithCommas, getObjKey} from '../../myLib';
import { socket } from '../../App';

const sideCode = {
    0: "sell",
    1: "buy"
}

const typeCode = {
    0: "limit",
    1: "market",
    2: "stop"
}

let accountCash = 102000

const Box = ({side}) => {
    const [orderType, setOrderType] = useState('limit')
    const [price, setPrice] = useState('')
    const [amount, setAmount] = useState('')

    let priceInput;

    if (orderType == "market"){
        priceInput = <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
                        <h3 className='py-2 pl-3 pr-9'>Price</h3>
                        <input 
                            type="number"
                            className="text-slate-50 w-full pl-2 bg-transparent " 
                            placeholder="Market Price" 
                            value={''}
                            onChange={(e)=> setPrice(e.target.value)}
                            disabled = {true}
                        />
                        <h3 className='py-2 px-3 right-0 '>USD</h3>
                    </div>
    } else {
        priceInput = <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
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
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()

        if (price <= 0 || amount <= 0) {
            alert("Input price or amount can not be less than 1")
        } else {            
            let msg
            if (orderType == 'market') {
                msg = `{ "side" : ${side}, "type" : ${getObjKey(typeCode, orderType)}, "price" :  ${null}, "amount" : ${amount} }`
                console.log(msg)
                socket.emit("message", msg)
            } else {
                msg = `{ "side" : ${side}, "type" : ${getObjKey(typeCode, orderType)}, "price" :  ${price}, "amount" : ${amount} }`
                console.log(msg)
                socket.emit("message", msg)
            }
            alert("order sent")
        }
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

                {priceInput}

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
                    <button className={side === 1 ? 'buy-button btn' : 'sell-button btn'}>{sideCode[side]}</button>
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