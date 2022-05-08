import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { useAlert } from 'react-alert';

import { getPricingGroups,
    getStation,
    deleteCharger } from '../../api/BackendCalls';
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import ModalCharger from '../../components/ModalCharger';
import AuthProvider from '../../context/AuthProvider';
import ModalChargerGroup from '../../components/ModalChargerGroup';


const Chargers = ({title, station, setStation, setActivePage}) => {
    useTitle({title});

    const { id } = useParams();
    const { getAuth } = AuthProvider();
    const navigate = useNavigate();

    const [pricingGroups, setPricingGroups] = useState(null);

    const alert = useAlert();


    // for the ModalCharger
    const [show1, setShow1] = useState(false);
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


    // for the ModalCharger
    const [show2, setShow2] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [pricingMethod, setPricingMethod] = useState("");
    // used to initialize the rest of the input when pricing method is changing
    const [prevPricingMethod, setPrevPricingMethod] = useState("");
    const [allExpenses, setAllExpenses] = useState("");
    const [gridPrice, setGridPrice] = useState(true);
    const [constant, setConstant] = useState("");
    const [constant2, setConstant2] = useState("");
    const [n, setN] = useState("");
    const [competitors, setCompetitors] = useState([]);
    const [groupId, setGroupId] = useState(null);

    const [stationLocation, setStationLocation] = useState({lat: 0, lng: 0, id: 0});
    const [center, setCenter] = useState({lat: 0, lng: 0});

    const handleAddCharger = (group) => {
        setChargerId(-1);
        setGroupId(group.id);
        setShow1(true);
    }
    const handleAddGroup = () => {
        setGroupId(null);
        setShow2(true);
    }
    const handleEditCharger = (charger, group) => {
        setCurrent(charger.current);
        setType(charger.connector_type);
        setPower(charger.power);
        setChargerName(charger.name);
        setChargerGroup(charger.charger_group);
        setChargerId(charger.id);

        setGroupId(group.id);
        setShow1(true);
    }
    const handleDelete = async (charger_id, group_id) => {
        if (charger_id === -1) return;

        // delete charger from chargers state
        const data = await deleteCharger(getAuth(), station.id, {
            charger_id: charger_id,
            charger_group: group_id
        });
        if (data.ok) {
            alert.success('Charger deleted successfully!');
            setShow1(false);
            initializeInputState();
            initializeFetchedData();
        } else {
            console.log("Something went wrong while deleting Charger");
        }
    }
    const initializeInputState = () => {
        // ModalCharger
        setCurrent("");
        setType("");
        setPower("");
        setChargerName("");
        setChargerGroup("");
        setChargerGroupName("");
        setChargerId(-1);

        // ModalChargerGroup
        setGroupName("");
        setPricingMethod("");
        setPrevPricingMethod("");
        setAllExpenses("");
        setGridPrice(false);
        setConstant("");
        setConstant2("");
        setN("");
        setCompetitors([]);
        setGroupId(null);
    }
    const handleEditGroup = (thisGroup) => {
        initializeInputState();

        setGroupId(thisGroup.id);
        setGroupName(thisGroup.name);

        setPrevPricingMethod("");

        if ("pricing_method" in thisGroup) {
            setPricingMethod(thisGroup["pricing_method"].name);
            let comp = [];
            for (let i=0; i<thisGroup["pricing_method"].variables.length; i++) {
                let v = thisGroup["pricing_method"].variables[i];
                if (v.name === "c" || v.name === "c1") setConstant(v.value);
                if (v.name === "all_expenses") setAllExpenses(v.value);
                if (v.name === "grid_price") setGridPrice(v.value);
                if (v.name === "c2") setConstant2(v.value);
                if (v.name === "n") setN(v.value);
                if(v.name === "competitors_coordinates") comp.push(v.value);
            }
            if (thisGroup["pricing_method"].name == "Competitor-centered Profit") {
                setCompetitors(comp);
            }

            setShow2(true);
        }
    }

    const fetchData = async () => {
        try {
            let {ok, data} = await getStation(getAuth(), id);
            if (!ok) {
                navigate("/app/not-authorized", { replace: true });
            }
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(station)) {
                setStation(data);
                setStationLocation({ latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude), id: data.id });
                setCenter({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
            }

            data = await getPricingGroups(getAuth(), id);
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

    const initializeFetchedData = () => {
        setStation({name: "", id: null});
        setPricingGroups(null);
    }

    useEffect(() => {
        let chargers = [];
        let groups = [];
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
        console.log(chargers);

    }, [pricingGroups])

    useEffect(() => {
        setActivePage("Chargers");
    }, [])

    return (
        <div className="flex-column-center-center">
            <section className="wrapper">
                <div className="flex-column-center-center station-chargers">
                    <h1>All Station Chargers</h1>

                    {!pricingGroups ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                    : (Object.entries(pricingGroups).map(([groupId, group]) => {
                        return (
                            <div key={groupId} className="flex-column-start-start station-chargers-div1">
                                <div className="full-width flex-row-between-center">
                                    <h2>Pricing Group: {group.name}</h2>
                                    <button
                                        className="edit-pricing-group"
                                        onClick={() => handleEditGroup(group)}
                                    >
                                        Edit Pricing Group
                                    </button>
                                </div>
                                <ul className="flex-column-start-center station-chargers-ul1">
                                    {group.chargers.map(charger => {
                                        return (
                                            <li key={charger.id} className="flex-row-between-center">
                                                <div>
                                                    <h2>{charger.name}</h2>
                                                    <p>{charger.power} kW | {charger.current}</p>
                                                    <p>{charger.connector_type}</p>
                                                    {charger.is_healthy ? (
                                                        <p className="healthy-charger">Healthy</p>
                                                    ) : (
                                                        <p className="not-healthy-charger">Not Healthy</p>
                                                    )}
                                                </div>
                                                <div className="station-chargers-buttons">
                                                    <button
                                                        className="blue-button-transparent"
                                                        onClick={() => handleEditCharger(charger, group)}
                                                    >
                                                        Edit Charger
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(charger.id, group.id)}
                                                        className="station-chargers-buttons-delete">Delete Charger</button>
                                                </div>
                                            </li>
                                        );

                                    })}
                                    <li className="flex-column-center-center add-charger">
                                        <button onClick={() => handleAddCharger(group)}>+</button>
                                    </li>
                                </ul>
                            </div>
                        );
                    }))}
                    <button className="station-chargers-div2" onClick={handleAddGroup}>
                        <p>+</p>
                        <h2>Add a Charger Group</h2>
                    </button>

                    <ModalCharger
                        station={station}
                        current={current}
                        setCurrent={setCurrent}
                        type={type}
                        setType={setType}
                        power={power}
                        setPower={setPower}
                        chargerName={chargerName}
                        setChargerName={setChargerName}
                        chargerGroupId={groupId}
                        chargerId={chargerId}
                        initializeFetchedData={initializeFetchedData}
                        initializeInputState={initializeInputState}
                        handleDelete={handleDelete}
                        fetchData={fetchData}
                        show={show1}
                        setShow={setShow1}
                    />

                    <ModalChargerGroup
                        show={show2}
                        setShow={setShow2}
                        station={station}
                        marker={stationLocation}
                        zoom={13}
                        center={center}
                        groupName={groupName}
                        setGroupName={setGroupName}
                        pricingMethod={pricingMethod}
                        setPricingMethod={setPricingMethod}
                        prevPricingMethod={prevPricingMethod}
                        setPrevPricingMethod={setPrevPricingMethod}
                        allExpenses={allExpenses}
                        setAllExpenses={setAllExpenses}
                        gridPrice={gridPrice}
                        setGridPrice={setGridPrice}
                        constant={constant}
                        setConstant={setConstant}
                        constant2={constant2}
                        setConstant2={setConstant2}
                        n={n}
                        setN={setN}
                        competitors={competitors}
                        setCompetitors={setCompetitors}
                        chargerGroups={chargerGroups}
                        setChargerGroups={setChargerGroups}
                        groupId={groupId}
                        initializeFetchedData={initializeFetchedData}
                    />

                </div>
            </section>
        </div>
    );
}
 
export default Chargers;
