import {React, useEffect, useState} from 'react';
import './index.css'
import { socket } from '../../App';


const Trades = () => {
    const [trades, setTrades] = useState([])
    const [time, setTime] =  useState('')

    const TradeList = ({list}) => {
        return (
            list.map((item, index) => (
                <tr key={index}>
                    <td>{item.price}</td>
                    <td>{item.amount}</td>
                    <td>{item.datetime}</td>
                </tr>
            ))
        )
    }


    const reconnect = () => {
        setTimeout(() => {
            if (socket) {
                console.log("socket initialized in parent component")
                socket.on("trades", (msg)=> {
                    let obj = JSON.parse(msg)
                    var dateNow = new Date()
                    obj.datetime = `${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`
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
    },[]);

    useEffect(() => {
        const interval = setInterval(() => {
            var date = new Date()
            setTime(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        }, 1000);

        return ()=>{
            clearInterval(interval)
        }
    },[])

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
