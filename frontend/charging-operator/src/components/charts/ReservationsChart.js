import { useEffect } from 'react';
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

const colors = [
    "#4450bb",
    "#e94016",
    "#2fd056",
    "#eeb411",
    "#f10eae",
    "#0fcdf0",
    "#e8ff00",
    "#88777f"
]


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

const ReservationChart = ({reservationsList, width, height, stations}) => {

    useEffect(() => {
        if (stations === null) return;
        for (const station of stations) {
            console.log(`${station.id}_number_reservations`)
        }
        console.log(reservationsList);
    }, [reservationsList, stations])

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
            <h3>Reservations per day for each of the stations</h3>
            {reservationsList && stations && stations.length > 0 && reservationsList.length > 0 ? (
                <>
                    <LineChart
                        className="gridprices-chart-chart"
                        width={width ? width : 900}
                        height={height ? height : 300}
                        data={reservationsList}>

                        <CartesianGrid strokeDasharray="3 3" />

                        {stations.map((station, index) => {
                                return (
                                    <Line
                                        key={station.id}
                                        type="monotone"
                                        dataKey={`${station.id}_number_reservations`}
                                        stroke={colors[index%stations.length]} 
                                        fill={colors[index%stations.length]} />
                                );
                            })}
                        <XAxis dataKey="day"/>
                        <YAxis />
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
