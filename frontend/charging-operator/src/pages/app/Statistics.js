import useTitle from "../../hooks/useTitle";
import AuthProvider from "../../context/AuthProvider";
import ReservationChart from "../../components/charts/ReservationsChart";
import { useEffect, useState } from "react";
import { getStations, statsReservations } from "../../api/BackendCalls";
import RevenuesChart from "../../components/charts/RevenuesChart";
import RevenuesPieChart from "../../components/charts/RevenuesPieChart";


const Statistics = ({title}) => {
    useTitle({title});

    const { getAuth } = AuthProvider();
    const [stations, setStations] = useState(null);
    const [stationCheck, setStationCheck] = useState(null);
    const [reservationsList, setReservationsList] = useState(null);
    const [revenues, setRevenues] = useState(null);

    const fetchData = async () => {
        let s = await getStations(getAuth());
        if (JSON.stringify(s) !== JSON.stringify(stations)) {
            setStations(s);
        }

        let data = await statsReservations(getAuth());
        if (JSON.stringify(data) !== JSON.stringify(reservationsList)) {
            setReservationsList(data);
        }

        let rev = [];
        let newStationCheck = {};
        for (let station of s) {
            rev[station.id] = [
                {
                    name: "Revenues from Charging",
                    value: 0
                },
                {
                    name: "Revenues from Parking",
                    value: 0
                }
            ]
            newStationCheck[station.id] = true;
        }
        if (stationCheck === null) {
            setStationCheck(newStationCheck);
        }

        for (const day of data) {
            for (let station of s) {
                rev[station.id][0].value += day[`${station.id}_energy`];
                rev[station.id][1].value += day[`${station.id}_parking`];
            }
        }

        if (JSON.stringify(rev) !== JSON.stringify(revenues)) {
            setRevenues(rev);
        }
    };

    useEffect(() => {
        fetchData();
    }, [reservationsList, stations, revenues, stationCheck])

    const changeStation = (id) => {
        const newStationCheck = JSON.parse(JSON.stringify(stationCheck));
        newStationCheck[id] = !newStationCheck[id];

        // we need to have at least 1 station enabled
        let exists = false;
        for (const station of stations)
            if (newStationCheck[station.id]) {
                exists = true;
            }
        if (exists) setStationCheck(newStationCheck);
    }

    return (
        <div className="flex-column-center-center">
            <section className="flex-column-start-center wrapper statistics">
                <h1>General Statistics</h1>
                <p className="statistics-info">
                    In this page you can find statistics for each one of your stations.
                    Those statistics are relates to the reservations made during the past 7 days (as well as today).
                </p>

                <div className="flex-column-center-center statistics-stations">
                    <h2>Select stations to display data</h2>
                    <div className="flex-row-center-center full-width">
                        {stations !== null && stationCheck !== null && stations.map((station) => {
                            return (
                                <div
                                    key={station.id}
                                    className="my-checkbox-all"
                                    onClick={() => changeStation(station.id)}>
                                    <div className={"my-checkbox" + " " + (stationCheck[station.id] ? "my-checkbox-checked" : "")} />
                                    <p>{station.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ReservationChart
                    reservationsList={reservationsList}
                    stations={stations}
                    stationCheck={stationCheck}
                    width={900}
                    height={500}
                />

                <RevenuesChart
                    reservationsList={reservationsList}
                    stations={stations}
                    stationCheck={stationCheck}
                    width={900}
                    height={500}
                />

                <div className="pie-charts-external flex-column-center-center">
                    <h2>Source of revenues for each station</h2>
                    <section className="pie-charts">
                        {revenues && stations && stations.length > 0 && stations.map((station) => {
                            if (stationCheck[station.id])
                                return (
                                    <RevenuesPieChart
                                        key= {station.id}
                                        revenues={revenues[station.id]}
                                        width={280}
                                        height={300}
                                        station={station}
                                    />
                                );
                        })}
                    </section>
                </div>
            </section>
        </div>
    );
}
 
export default Statistics;
