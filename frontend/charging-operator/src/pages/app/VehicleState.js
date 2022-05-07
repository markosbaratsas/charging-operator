import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStation, getVehicleState } from "../../api/BackendCalls";
import ReactLoading from 'react-loading';

import Navbar5 from '../../components/Navbar5';
import useTitle from "../../hooks/useTitle";
import AuthProvider from "../../context/AuthProvider";

const VehicleState = ({title, station, setStation}) => {
    useTitle({title});

    const { id: stationId,  vehicleStateId } = useParams();
    const { getAuth } = AuthProvider();
    const navigate = useNavigate();

    const [vehicleState, setVehicleState] = useState(null);

    const fetchData = async () => {
        try {
            let {ok, data} = await getStation(getAuth(), stationId);
            if (!ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

            data = await getVehicleState(getAuth(), stationId, vehicleStateId);
            if (!data.ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data.data) !== JSON.stringify(vehicleState)) setVehicleState(data.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [station, vehicleState])

    return (
    <>
        <Navbar5 stationName={station.name} stationId={stationId} active={"Vehicle State"}/>
            <div className="content">
                <div className="flex-column-center-center">
                    <section className="wrapper">
                        <div className="flex-column-center-center vehicle-state">
                            <div className="flex-row-center-center text-icon">
                                <h1>Vehicle State</h1>
                                <img src="/icons/live.png" alt="Charger icon" />
                            </div>
                            <div className="vehicle-state-div">
                                {!vehicleState ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                                : (
                                    <div className="flex-column-start-start">
                                        <div className="vehicle-state-div2">
                                            <h3>Model:</h3>
                                            <h4>{vehicleState.model}</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Licence plate:</h3>
                                            <h4>{vehicleState.license_plate}</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Charging in:</h3>
                                            <h4>{vehicleState.charging_in}</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Arrived at:</h3>
                                            <h4>{vehicleState.arrival}</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Expected departure at:</h3>
                                            <h4>{vehicleState.expected_departure}</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Current battery:</h3>
                                            <h4>{vehicleState.current_battery} kW</h4>
                                        </div>
                                        <div className="vehicle-state-div2">
                                            <h3>Desired final battery:</h3>
                                            <h4>{vehicleState.desired_final_battery} kW</h4>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
    </>
    );
}
 
export default VehicleState;
