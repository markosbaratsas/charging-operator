import {
    LineChart, 
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip } from 'recharts';


function CustomTooltip({ payload, active }) {
    if (active) {
        return (
        <div className="custom-tooltip1">
            <p><span>Price:</span> {payload[0].payload.price} €/KWh</p>
            <p><span>From:</span> {payload[0].payload.start_time}</p>
            <p><span>To:</span> {payload[0].payload.end_time}</p>
        </div>
        );
    }
    return null;
}

const GridPriceChart = ({gridPricesList, width, height}) => {
    return (
        <section className="gridprices-chart">
            <h3>Most recent grid prices</h3>
            {gridPricesList ? (
                <LineChart
                className="gridprices-chart-chart"
                width={width ? width : 900}
                height={height ? height : 300}
                data={gridPricesList}>
                    <Line isAnimationActive={false}
                        type="monotone" dataKey="price" stroke="#7272CC" />
                    <CartesianGrid stroke="#909090" strokeDasharray="0.1 0.1" />
                    <XAxis dataKey="start_time_time" tick={{ fill: "#404040", fontSize: "14px" }} />
                    <YAxis tick={{ fill: "#404040", fontSize: "14px" }}/>
                    <Tooltip content={<CustomTooltip />}/>
                </LineChart>
            ) : <div style={{ width: "400px", height: "400px", backgroundColor: "#202020" }}
            ></div>}
            <p>Hover on the chart to see more information about the grid prices.</p>
        </section>
    );
}

export default GridPriceChart;
