import { useState, useEffect } from 'react'
import Chart from './components/Chart'
import OrderBook from './components/OrderBook'
import OrderBox from './components/OrderBox'
import { io } from 'socket.io-client'


let socket = io('ws://localhost:3000');


function App() {
  return (
    <div className='flex flex-row w-screen h-screen'>

      <div className='flex flex-col w-5/6 h-full'>
        <div className='grow'>
          <Chart/>
        </div>
        <div>
          <OrderBox />
        </div>
      </div>
      <OrderBook />
    </div>
  )
}

export default App
export {socket}
