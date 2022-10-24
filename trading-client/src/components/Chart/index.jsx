import React from 'react';
import data from "../../data.json"
import "./index.css"

let table = anychart.data.table(), mapping, chart, plot, series;


anychart.onDocumentLoad(function () {

    table.addData(data.slice(-50));
    //initialized setting
    init()

    // display the chart
    chart.container('container');
    chart.draw();
});

function init() {
    anychart.theme(anychart.themes.darkGlamour)

    // mapping the data  
    mapping = table.mapAs();
    mapping.addField('open', 1, 'first');
    mapping.addField('high', 2, 'max');
    mapping.addField('low', 3, 'min');
    mapping.addField('close', 4, 'last');
    mapping.addField('value', 4, 'last');
    
    // defining the chart type
    chart = anychart.stock();
    plot = chart.plot(0)

    chart.scroller().enabled(false);
    
    // set the series type
    series = plot.candlestick(mapping).name('GOOG');
    // series.legendItem().iconType('rising-falling');
    
    // chart.scroller().candlestick(mapping);
    // // chart.selectRange('2010-01-27', '2021-11-26');
    // // create range picker
    // let rangePicker = anychart.ui.rangePicker();
    
    // // init range picker
    // rangePicker.render(chart);
    
    // // create range selector
    // let rangeSelector = anychart.ui.rangeSelector();
    
    // // init range selector
    // rangeSelector.render(chart);
    
    // set grid settings
    plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
    
    // setting the chart title
    // chart.title('Your grandma');
}

const Chart = () => {
    return (
        <div className='main-chart border-2 border-gray-600'>
            <div id='container' className='ticker h-full'></div>
        </div>
    );
};

export default Chart;


