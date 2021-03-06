import ReactLoading from 'react-loading';
import {
    LineChart, 
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    BarChart,
    Legend,
 } from 'recharts';
 import { colors } from './common';


function CustomTooltip({ payload, active, stations }) {
    if (active) {
        return (
        <div className="custom-tooltip2">
            {stations.map((station, index) => {
                return (
                    <p
                        key={station.id}
                        style={{color: colors[index%stations.length]}}
                    >
                        #reservations in {station.name}: 
                        <span>{payload[0].payload[`${station.id}_number_reservations`]}</span>
                    </p>
                );
            })}
        </div>
        );
    }
    return null;
}

const ReservationChart = ({ reservationsList, width, height, stations, stationCheck }) => {

    const findStationNameFromId = (id) => {
        id = parseInt(id)
        for(const station of stations) {
            if (station.id == id) {
                return station.name;
            }
        }
        return "not found";
    }

    return (
        <section className="gridprices-chart reservations-chart">
            <h3>Reservations per day for each station</h3>
            {reservationsList && stations && stations.length > 0 && reservationsList.length > 0 ? (
                <>
                    <LineChart
                        className="gridprices-chart-chart"
                        width={width ? width : 900}
                        height={height ? height : 300}
                        data={reservationsList}>

                        <CartesianGrid strokeDasharray="3 3" />

                        {stationCheck && stations.map((station, index) => {
                            if (stationCheck[station.id])
                                return (
                                    <Line
                                        key={station.id}
                                        type="monotone"
                                        dataKey={`${station.id}_number_reservations`}
                                        stroke={colors[index%stations.length]} 
                                        fill={colors[index%stations.length]} />
                                );
                            })}
                        <XAxis dataKey="day" stroke="#444" tick={{stroke: "#444", strokeWidth: 0.01}} />
                        <YAxis stroke="#444" />
                        <Tooltip content={<CustomTooltip />} stations={stations} />
                        <Legend
                            wrapperStyle={{
                                border: "1px solid #aaa",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f3f3f3"
                            }}
                            align="center"
                            layout="horizontal"
                            height={36}
                            formatter={(value, entry, index) => (findStationNameFromId(value.split("_")[0]))}
                        />
                    </LineChart>
                    <p>Hover on the chart to see more information about the reservations.</p>
                </>
            ) : (
                <div
                    className="flex-column-center-center" 
                    style={{ 
                        width: width ? String(width) + "px" : "900px",
                        height: String(height) + "px" ? height : "300px" 
                    }}>
                    <ReactLoading type="spin" color="#202020" height={80} width={80}/>
                </div>
            )}
        </section>
    );
}

export default ReservationChart;
