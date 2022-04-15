import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import { getPricingGroups,
    getStation,
    deleteCharger } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import ModalCharger from '../../components/ModalCharger';


const Chargers = ({title}) => {
    useTitle({title});

    const { id } = useParams();

    const [pricingGroups, setPricingGroups] = useState(null);
    const [station, setStation] = useState({name: "", id: null});

    const alert = useAlert();


    // for the modal
    const [show, setShow] = useState(false);
    const [chargers, setChargers] = useState(null);
    const [chargerGroups, setChargerGroups] = useState(null);
    const [chargerCount, setChargerCount] = useState(-1);
    const [groupCount, setGroupCount] = useState(-1);
    const [current, setCurrent] = useState("");
    const [type, setType] = useState("");
    const [power, setPower] = useState("");
    const [chargerName, setChargerName] = useState("");
    const [chargerGroup, setChargerGroup] = useState("");
    const [chargerGroupName, setChargerGroupName] = useState("");
    const [chargerId, setChargerId] = useState(-1);


    const handleAdd = () => {
        setChargerId(-1);
        setShow(true);
    }
    const handleEditCharger = (charger) => {
        setCurrent(charger.current);
        setType(charger.connector_type);
        setPower(charger.power);
        setChargerName(charger.charger_name);
        setChargerGroup(charger.charger_group);
        setChargerId(charger.id);

        setShow(true);
    }
    const handleDelete = async (charger) => {
        // delete charger from chargers state
        const {ok, errors} = await deleteCharger(charger.id);

        if (!ok) {
            console.log(errors);
            return
        }

        alert.success('Charger deleted successfully');
        initializeInputState();
        setShow(false);
    }
    const initializeInputState = () => {
        setCurrent("");
        setType("");
        setPower("");
        setChargerName("");
        setChargerGroup("");
        setChargerGroupName("");
        setChargerId(-1);
    }

    const fetchData = async () => {
        try {
            let data = await getStation(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) setStation(data);

            data = await getPricingGroups(id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(pricingGroups)) setPricingGroups(data);
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
    }, [station, pricingGroups])

    useEffect(() => {
        let chargers = [];
        let groups = [{id: -1, name: "... Add a new Charger Group"}];
        if (!pricingGroups) return;
        for (const [groupId, group] of Object.entries(pricingGroups)) {
            if (!group.chargers) return;
            for (const charger of group.chargers) {
                const copy = JSON.parse(JSON.stringify(charger))
                chargers.push(copy);
                setChargerCount(Math.max(charger.id, chargerCount));
            }

            groups.push({
                name: group.name,
                id: group.id
            });
            setGroupCount(Math.max(group.id, groupCount));
        }

        setChargers(chargers);
        setChargerGroups(groups);

    }, [pricingGroups])

    return (
        <>
        <Navbar4 stationName={station.name} stationId={id} active={"Overview"}/>
        <div className="content">
            <div className="flex-column-center-center">
            <section className="wrapper">
                <div className="flex-column-center-center station-chargers">
                    <h1>All Station Chargers</h1>

                    {!pricingGroups ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                    : (Object.entries(pricingGroups).map(([groupId, group]) => {
                        return (
                            <div key={groupId} className="flex-column-start-start station-chargers-div1">
                                <h2>Pricing Group: {group.name}</h2>
                                <ul className="flex-column-start-center station-chargers-ul1">
                                    {group.chargers.map(charger => {
                                        return (
                                            <li key={charger.id} className="flex-row-between-center">
                                                <div>
                                                    <h2>{charger.name}</h2>
                                                    <p>{charger.power} kW | {charger.current}</p>
                                                    <p>{charger.connector_type}</p>
                                                </div>
                                                <div className="station-chargers-buttons">
                                                    <button
                                                        className="station-chargers-buttons-edit"
                                                        onClick={() => handleEditCharger(charger)}
                                                    >
                                                        Edit Charger
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(charger)}
                                                        className="station-chargers-buttons-delete">Delete Charger</button>
                                                </div>
                                            </li>
                                        );

                                    })}
                                    <li className="flex-column-center-center add-charger">
                                        <button onClick={handleAdd}>+</button>
                                    </li>
                                </ul>
                            </div>
                        );
                    }))}

                    <ModalCharger
                        chargers={chargers}
                        chargerGroups={chargerGroups}
                        current={current}
                        setCurrent={setCurrent}
                        type={type}
                        setType={setType}
                        power={power}
                        setPower={setPower}
                        chargerName={chargerName}
                        setChargerName={setChargerName}
                        chargerGroup={chargerGroup}
                        setChargerGroup={setChargerGroup}
                        chargerGroupName={chargerGroupName}
                        setChargerGroupName={setChargerGroupName}
                        chargerId={chargerId}
                        setChargerId={setChargerId}
                        initializeInputState={initializeInputState}
                        handleDelete={handleDelete}
                        fetchData={fetchData}
                        show={show}
                        setShow={setShow}
                    />

                </div>
            </section>
            </div>
        </div>
    </>
    );
}
 
export default Chargers;
