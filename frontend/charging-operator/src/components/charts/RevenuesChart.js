import ReactLoading from 'react-loading';
import {
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
            <p style={{textAlign: "center"}}><span>{payload[0].payload["day"]}</span></p>
            {stations.map((station, index) => {
                return (
                    <p
                        key={station.id}
                        style={{color: colors[index%stations.length]}}
                    >
                        Total revenues in {station.name}:
                        <span>{(payload[0].payload[`${station.id}_all`]).toFixed(3)} €</span>
                    </p>
                );
            })}
        </div>
        );
    }
    return null;
}

const RevenuesChart = ({ reservationsList, width, height, stations, stationCheck }) => {

    const findStationNameFromId = (id) => {
        id = parseInt(id)
        for(const station of stations) {
            if (station.id == id) {
                return station.name;
            }
        }
        return "not found";
    }

    const getTotalRevenuesFromID = (id) => {
        let ret = 0;
        for(const day of reservationsList) {
            ret += day[`${id}_all`]
        }
        return ret.toFixed(2);
    }

    return (
        <section className="gridprices-chart reservations-chart">
            <h3>Revenues per day for each station</h3>
            {reservationsList && stations && stations.length > 0 && reservationsList.length > 0 ? (
                <>
                    <BarChart
                        className="gridprices-chart-chart"
                        width={width ? width : 900}
                        height={height ? height : 300}
                        data={reservationsList}>

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
                        {stationCheck && stations.map((station, index) => {
                            if (stationCheck[station.id])
                                return (
                                    <Bar
                                        key={station.id}
                                        type="monotone"
                                        dataKey={`${station.id}_all`}
                                        stroke={colors[index%stations.length]} 
                                        fill={colors[index%stations.length]} />
                                );
                            })}
                    </BarChart>
                    {stationCheck && stations.map((station, index) => {
                        if (stationCheck[station.id])
                            return (
                                <p key={station.id}>
                                    Total Revenues for {station.name}: <span>{getTotalRevenuesFromID(station.id)} €</span>
                                </p>
                            );
                    })}
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

export default RevenuesChart;
