import {React, useState, useEffect} from 'react';
import data from "../../data.json"
import "./index.css"

// create data => create chart => render chart

let table, mapping, chart;

anychart.onDocumentLoad(function () {
    anychart.theme(anychart.themes.darkGlamour)

    // create data
    table = anychart.data.table(0)
    table.addData(data.slice(-50));
    // mapping the data  
    mapping = table.mapAs();
    mapping.addField('open', 1, 'first');
    mapping.addField('high', 2, 'max');
    mapping.addField('low', 3, 'min');
    mapping.addField('close', 4, 'last');
    

    // create chart
    chart = anychart.stock();
    chart.plot(0)
    chart.scroller().enabled(false);
    // set the series type
    chart.plot(0).candlestick(mapping).name('GOOG');
    // set grid settings
    chart.plot(0).yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
    // display the chart
    chart.container('container');


    // rendering chart
    chart.draw();
});

const nextDate = (date) => {
    date.setTime(date.getTime() + 1000 * 60 * 1);
    if (date.getUTCHours() > 18) {
        date.setUTCDate(date.getUTCDate() + 1);
        date.setUTCHours(9);
    }
    if (date.getUTCDay() == 6) {
        date.setUTCDate(date.getUTCDate() + 2);
    } else if (date.getUTCDay() == 0) {
        date.setUTCDate(date.getUTCDate() + 1);
    }
}

const updateData = () => {
    // table.addData() per minutes
}

const recordOCHL = () => {
    // record the ochl of a minute
}

const Chart = () => {
    let startDate = new Date(new Date().getUTCFullYear() - 4, 0)

    useEffect(() => {
        let current = new Date(startDate.getTime())
        const interval = setInterval(() => {
            console.log(current)
            nextDate(current)
        }, 5000);

        return ()=>{
            clearInterval(interval)
        }
    }, [])

    return (
        <div className='main-chart border-2 border-gray-600'>
            <div id='container' className='ticker h-full'></div>
        </div>
    );
};

export default Chart;


