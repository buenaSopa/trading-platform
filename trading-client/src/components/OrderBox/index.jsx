import React from 'react';
import "./index.css"

const sideIds = {
    0: "sell",
    1: "buy"
}

function orderTypeHandler(e) {
    e.preventDefault()

}

const Box = ({side}) => (
    <div className='border-2 rounded-lg flex flex-col border-gray-300 box p-3 h-fit m-5'>
        <form className='space-y-3'>
            <div className=" flex ">
                Available: 102,000 USD
            </div>
            <div className=" flex-row flex gap-4 ">
                <button onClick={orderTypeHandler} id="limit" className="border-2 rounded-md grow focus:bg-white focus:text-black">Limit Order</button>
                <button onClick={orderTypeHandler} id="market" className="border-2 rounded-md grow focus:bg-white focus:text-black">Market Order</button>
                <button onClick={orderTypeHandler} id="stop" className="border-2 rounded-md grow focus:bg-white focus:text-black">Stop Order</button>
            </div>
            <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
                <h3 className='py-2 pl-3 pr-9'>Price</h3>
                <input id="price" className="text-slate-50 w-full pl-2 bg-transparent " placeholder="100.00" required/>
                <h3 className='py-2 px-3 right-0 '>USD</h3>
            </div>
            <div className=" flex-row flex rounded-md bg-transparent border-2 border-gray-600">
                <h3 className='py-2 px-3 '>Amount</h3>
                <input id="amount" className="text-slate-50 w-full  pl-2 bg-transparent " placeholder="10,000.00" required/>
                <h3 className='py-2 px-3 right-0 '>GOOG</h3>
            </div>
            <div className=' flex'>
                <button className={side === 1 ? 'buy-button btn' : 'sell-button btn'}>{sideIds[side]}</button>
            </div>
        </form>
    </div>
)

const OrderBox = () => {
    return (
        <div className='main-box flex flex-row border-2 border-gray-600'>   
            <Box side={1}/>
            <Box side={0}/>
        </div>
    );
};

export default OrderBox;