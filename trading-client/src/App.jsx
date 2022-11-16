import { useState, useEffect } from 'react'
import Chart from './components/Chart'
import OrderBook from './components/OrderBook'
import OrderBox from './components/OrderBox'
import Trades from './components/Trades'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:3000');

function App() {
  return (
    <div className='flex flex-row w-screen h-screen'>

      <div className='flex flex-col w-9/12 h-full'>
        <div className='grow'>
          <Chart/>
        </div>
        <div>
          <OrderBox socket={socket}/>
        </div>
      </div>
      <div className='flex flex-col grow bg-slate-600'>
        <div className='h-1/2'>
          <OrderBook />
        </div>
        <div className='h-1/2'>
          <Trades />
        </div>
      </div>
    </div>
  )
}

export default App
export {socket}
