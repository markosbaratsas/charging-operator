import useTitle from "../../hooks/useTitle";
import AuthProvider from "../../context/AuthProvider";
import ReservationChart from "../../components/charts/ReservationsChart";
import { useEffect, useState } from "react";
import { getStations, statsReservations } from "../../api/BackendCalls";


const Statistics = ({title}) => {
    useTitle({title});

    const { getAuth } = AuthProvider();
    const [stations, setStations] = useState(null);
    const [reservationsList, setReservationsList] = useState(null);

    const fetchData = async () => {
        let data = await getStations(getAuth());
        setStations(data);

        
        data = await statsReservations(getAuth());
        if (JSON.stringify(data) !== JSON.stringify(reservationsList)) {
            setReservationsList(data);
        }
    };

    useEffect(() => {
        fetchData();
    }, [reservationsList])

    return (
        <div className="flex-column-center-center">
            <section className="flex-column-start-center wrapper statistics">
                <h1>General Statistics</h1>

                <ReservationChart 
                reservationsList={reservationsList}
                stations={stations}
                width={900}
                height={500}
                />

                

            </section>
        </div>
    );
}
 
export default Statistics;
