import {React, useEffect, useState} from 'react';
import './index.css'
import { socket } from '../../App';
import { fixedFloating } from '../../myLib';


const Trades = () => {
    const [trades, setTrades] = useState([])
    const [time, setTime] =  useState('')

    const TradeList = ({list}) => {
        return (
            list.map((item, index) => (
                <tr key={index}>
                    <td className='text-center'>{item.price}</td>
                    <td className='text-center'>{item.amount}</td>
                    <td className='text-center'>{item.datetime}</td>
                </tr>
            ))
        )
    }

    const reconnect = () => {
        setTimeout(() => {
            if (socket) {
                console.log("trades socket initialized in parent component")
                socket.on("trades", (msg)=> {
                    let obj = JSON.parse(msg)
                    var dateNow = new Date()
                    obj.datetime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
                    obj.price = fixedFloating(obj.price)
                    console.log("trades received: ", obj, time)
                    setTrades(trades => [obj, ...trades])
                })
            } else {
                console.log("waiting for socket to be initialized...")
                reconnect()
            }
        }, 1000);
    }

    useEffect(() => {
        reconnect()      
        const interval = setInterval(() => {
            let date = new Date()
            setTime(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        }, 1000);

        return ()=>{
            clearInterval(interval)
        }
    }, [])

    return (
        <div className='main-book border-2 border-gray-600 overflow-y-scroll'>
            <p className='text-center py-1 text-xs'>Trades {time}</p>
            <table className=''>
                <thead className=''>
                    <tr>
                        <th>PRICE</th>
                        <th>QUANTITY</th>
                        <th>TIME</th>
                    </tr>
                </thead>
                <tbody>
                    <TradeList list={trades} />
                </tbody>
            </table>            
        </div>
    );
}

export default Trades;
