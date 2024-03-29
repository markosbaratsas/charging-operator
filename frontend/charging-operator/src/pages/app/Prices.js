import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Modal } from 'react-bootstrap';
import { useAlert } from 'react-alert';

import { getGridPrice,
    getGridPrices,
    getPricingGroups,
    getStation,
    getMarkers, 
    updatePricingGroup} from '../../api/BackendCalls';
import Select from "../../components/Select/Select";
import Navbar4 from '../../components/Navbar4';
import useTitle from "../../hooks/useTitle";
import Map4 from "../../components/Map4/Map";
import Map3 from "../../components/Map3/Map";
import { upTo } from '../../utils/usefulFunctions';
import AuthProvider from '../../context/AuthProvider';
import GridPriceChart from '../../components/charts/GridPriceChart';


const pricingMethods = [
    {
        name: "Fixed Price",
        id: 1,
        variables: [
            {
                name: "c",
                id: 1
            }
        ]
    },
    {
        name: "Fixed Profit",
        id: 2,
        variables: [
            {
                name: "all_expenses",
                id: 1
            },
            {
                name: "grid_price",
                id: 2
            },
            {
                name: "c",
                id: 3
            }
        ]
    },
    {
        name: "Demand-centered Profit",
        id: 3,
        variables: [
            {
                name: "all_expenses",
                id: 1
            },
            {
                name: "grid_price",
                id: 2
            },
            {
                name: "c1",
                id: 3
            },
            {
                name: "c2",
                id: 4
            },
            {
                name: "n",
                id: 5
            }
        ]
    },
    {
        name: "Competitor-centered Profit",
        id: 4,
        variables: [
            {
                name: "all_expenses",
                id: 1
            },
            {
                name: "grid_price",
                id: 2
            },
            {
                name: "c1",
                id: 3
            },
            {
                name: "competitors_coordinates",
                id: 4
            },
            {
                name: "c2",
                id: 5
            }
        ]
    }
]


const Prices = ({title, station, setStation, setActivePage}) => {
    useTitle({title});
    const { id } = useParams();
    const navigate = useNavigate();

    const [groupSelected, setGroupSelected] = useState(null);
    const [groups, setGroups] = useState(null);
    const [gridPrice2, setGridPrice2] = useState(null);
    const [gridPricesList, setGridPricesList] = useState(null);

    const [stationLocation, setStationLocation] = useState({lat: 0, lng: 0, id: null});
    const [center, setCenter] = useState({lat: 0, lng: 0});

    // for the modal
    const alert = useAlert();

    const { getAuth } = AuthProvider();
    const [stationsMarkers, setStationsMarkers] = useState([]);
    const [show, setShow] = useState(false);

    const [pricingMethod, setPricingMethod] = useState("");
    const [pricingMethodError, setPricingMethodError] = useState(false);

    // used to initialize the rest of the input when precing method is changing
    const [prevPricingMethod, setPrevPricingMethod] = useState("");
    
    const [constant, setConstant] = useState("");
    const [constantError, setConstantError] = useState(false);

    const [gridPrice, setGridPrice] = useState(true);
    const [currentGridPrice, setCurrentGridPrice] = useState(null);

    const [allExpenses, setAllExpenses] = useState("");
    const [allExpensesError, setAllExpensesError] = useState(false);

    const [constant2, setConstant2] = useState("");
    const [constant2Error, setConstant2Error] = useState(false);

    const [n, setN] = useState("");
    const [nError, setNError] = useState(false);

    const [competitors, setCompetitors] = useState([]);
    const [competitorsError, setCompetitorsError] = useState(false);

    useEffect(async () => {
        if (station.id === null) return;
        const mark = await getMarkers(getAuth());
        setStationsMarkers(mark);
        const data = await getGridPrice(getAuth(), station.id);
        setCurrentGridPrice(data.price);
    }, [station])

    useEffect(() => {
        setActivePage("Prices");
    }, [])

    const handleEdit = () => {
        let thisGroup = JSON.parse(JSON.stringify(groups[groupSelected]));

        initializeInputState();

        // needed to have the expected behavior
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
        }
        setShow(true);
    }
    const handleClose = () => {
        initializeInputState();
        setShow(false);
    }
    const handleSetPricingMethod = async () => {
        let thisGroup = JSON.parse(JSON.stringify(groups[groupSelected]));

        if (!pricingMethod) {
            setPricingMethodError(true);
            return;
        }

        let errors = false;

        if (pricingMethod === "Fixed Price") {
            if (!constant) {
                setConstantError(true);
                errors = true;
            }
            if (errors) return;

            thisGroup["pricing_method"] = {
                name: pricingMethod,
                variables: [
                    {
                        name: "c",
                        id: 1,
                        value: constant,
                        type: "float"
                    }
                ]
            }
        }

        if (pricingMethod === "Fixed Profit") {
            if (!constant) {
                setConstantError(true);
                errors = true;
            }
            if (!allExpenses) {
                setAllExpensesError(true);
                errors = true;
            }
            if (errors) return;

            thisGroup["pricing_method"] = {
                name: pricingMethod,
                variables: [
                    {
                        name: "all_expenses",
                        id: 1,
                        value: allExpenses,
                        type: "float"
                    },
                    {
                        name: "grid_price",
                        id: 2,
                        value: gridPrice,
                        type: "bool"
                    },
                    {
                        name: "c",
                        id: 3,
                        value: constant,
                        type: "float"
                    }
                ]
            }
        }

        if (pricingMethod === "Demand-centered Profit") {
            if (!constant)  {
                setConstantError(true);
                errors = true;
            }
            if (!constant2) {
                setConstant2Error(true);
                errors = true;
            }
            if (!allExpenses) {
                setAllExpensesError(true);
                errors = true;
            }
            if (!n || n % 1 !== 0) {
                setNError(true);
                errors = true;
            }
            if (errors) return;

            thisGroup["pricing_method"] = {
                name: pricingMethod,
                variables: [
                    {
                        name: "all_expenses",
                        id: 1,
                        value: allExpenses,
                        type: "float"
                    },
                    {
                        name: "grid_price",
                        id: 2,
                        value: gridPrice,
                        type: "bool"
                    },
                    {
                        name: "c1",
                        id: 3,
                        value: constant,
                        type: "float"
                    },
                    {
                        name: "c2",
                        id: 4,
                        value: constant2,
                        type: "float"
                    },
                    {
                        name: "n",
                        id: 5,
                        value: n,
                        type: "int"
                    }
                ]
            }
        }

        if (pricingMethod === "Competitor-centered Profit") {
            if (!constant)  {
                setConstantError(true);
                errors = true;
            }
            if (!constant2) {
                setConstant2Error(true);
                errors = true;
            }
            if (!allExpenses) {
                setAllExpensesError(true);
                errors = true;
            }
            if (competitors.length === 0) {
                setCompetitorsError(true);
                errors = true;
            }
            if (errors) return;

            thisGroup["pricing_method"] = {
                name: pricingMethod,
                variables: [
                    {
                        name: "all_expenses",
                        id: 1,
                        value: allExpenses,
                        type: "float"
                    },
                    {
                        name: "grid_price",
                        id: 2,
                        value: gridPrice,
                        type: "bool"
                    },
                    {
                        name: "c1",
                        id: 3,
                        value: constant,
                        type: "float"
                    },
                    {
                        name: "competitors_coordinates",
                        id: 4,
                        value: competitors,
                        type: "list_of_coordinates"
                    },
                    {
                        name: "c2",
                        id: 5,
                        value: constant2,
                        type: "float"
                    }
                ]
            }
        }

        const data = await updatePricingGroup(getAuth(), station.id, thisGroup);
        if (data.ok) {
            setShow(false);
            alert.success('Pricing Method updated successfully!');
            initializeInputState();
            initializeFetchedData();
        }
        else {
            console.log("sth went wrong...");
        }
    }
    
    const initializeInputState = () => {
        setPricingMethod("");
        setConstant("");
        setAllExpenses("");
        setConstant2("");
        setN("");
        setCompetitors([]);
        setPricingMethodError(false);
        setConstantError(false);
        setAllExpensesError(false);
        setConstant2Error(false);
        setNError(false);
        setCompetitorsError(false);
    }
    
    useEffect(() => {
        setPricingMethodError(false);
        setConstantError(false);
        setAllExpensesError(false);
        setConstant2Error(false);
        setNError(false);
        setCompetitorsError(false);
    }, [pricingMethod, constant, allExpenses, constant2, n, competitors])

    useEffect(() => {
        if (prevPricingMethod !== "") {
            setConstant("");
            setAllExpenses("");
            setConstant2("");
            setN("");
            setCompetitors([]);
        }
    }, [pricingMethod])

    const initializeFetchedData = () => {
        setStation({name: ""});
        setGroupSelected(null);
        setGroups(null);
        setGridPrice2(null);
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
            }
            if (data.id !== stationLocation.id) {
                setStationLocation({ latitude: parseFloat(data.latitude), longitude: parseFloat(data.longitude), id: data.id });
                setCenter({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
            }

            data = await getPricingGroups(getAuth(), id);
            // check if data changed
            if (JSON.stringify(data) !== JSON.stringify(groups)) setGroups(data);
            
            data = await getGridPrice(getAuth(), id);
            // check if data changed
            if (data && JSON.stringify(data) !== JSON.stringify(gridPrice2)) setGridPrice2(data);

            data = await getGridPrices(getAuth(), id, 10);
            if (data && JSON.stringify(data) !== JSON.stringify(gridPricesList)) {
                setGridPricesList(data);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        if (groupSelected === null && groups && Object.keys(groups).length)
            setGroupSelected(Object.keys(groups)[0]);
    }, [station, groups, gridPrice2])

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => {
            fetchData();
        }, 5000);
        return () => clearInterval(interval);
    }, [station, groups, gridPrice2])

    return (
    <>
        <div className="flex-column-center-center">
        <section className="wrapper">
            <div className="flex-column-center-center station-prices">
                <h1>Select Pricing Group</h1>
                <ul className="station-prices-ul1">
                    {!groups ? <ReactLoading type="balls" color="#202020" height={30} width={30} className="loading"/>
                    : (Object.entries(groups).map(([groupId, price]) => {
                            return (
                                <li key={groupId}
                                    onClick={() => setGroupSelected(groupId)}
                                    className={(groupSelected === groupId)
                                                ? "station-prices-selected"
                                                : "station-prices-not-selected"}>
                                    <h3>{price.name}</h3>
                                    <h4>{price.current_price} €/KWh</h4>
                                </li>
                            );
                        })
                    )}
                </ul>

                {!(groups && (groupSelected in groups)) ? (<ReactLoading type="balls" color="#202020" height={50} width={50} className="loading"/>
                ) : (
                    <>

                        <div className="station-prices-current-price">
                            <h2>Current price: <span>{groups[groupSelected].current_price} €/KWh</span></h2>
                        </div>

                        <div className="station-prices-div1">
                            <h3>Pricing Strategy for 50 kW Chargers</h3>
                            <div className="flex-row-around-start station-prices-div2">
                                <div className="station-prices-pricing-method">
                                    <h2>{groups[groupSelected].pricing_method.name}</h2>

                                    <div className="method_images">
                                        {(groups[groupSelected].pricing_method.name === "Fixed Price") ? (
                                            <img src="/img/pricing_methods/fixed-price-method.png" alt="" />
                                        ) : (groups[groupSelected].pricing_method.name === "Fixed Profit")  ? (
                                            <img src="/img/pricing_methods/fixed-profit-method.png" alt="" />
                                        ) : (groups[groupSelected].pricing_method.name === "Demand-centered Profit")  ? (
                                            <img src="/img/pricing_methods/demand-centered-method.png" alt="" />
                                        ) : (groups[groupSelected].pricing_method.name === "Competitor-centered Profit")  ? (
                                            <img src="/img/pricing_methods/competitor-centered-profit-method.png" alt="" />
                                        ) : null}
                                    </div>
                                    <h4>Where you defined:</h4>
                                    {groups[groupSelected].pricing_method.variables.filter(elem => (
                                            elem.name !== "competitors_coordinates"
                                            && elem.name !== "grid_price"
                                        )).map(elem => {
                                        return (
                                            <p key={elem.id}>{elem.name}: <span>{elem.value}</span></p>
                                        );
                                    })}
                                    {groups[groupSelected].pricing_method.variables.filter(elem => elem.name === "grid_price").map(elem => {
                                        return (
                                            <p key={elem.id}>Grid Price: <span>{elem.value ? "Yes" : "No"}</span></p>
                                        );
                                    })}

                                    {(groups[groupSelected].pricing_method.name === "Competitor-centered Profit"
                                            && station && stationLocation.id !== null && station.latitude && station.longitude && groups[groupSelected].pricing_method
                                            && groups[groupSelected].pricing_method.variables)  ? (
                                        <>
                                            <p>Number of competitors selected: <span>{groups[groupSelected].pricing_method.variables.filter(elem => elem.name === "competitors_coordinates").length}</span></p>
                                            <p><span>See the competitors on the map below:</span></p>
                                            <div className="map-div2">
                                                <Map4
                                                    marker={stationLocation}
                                                    markers={groups[groupSelected].pricing_method.variables.filter(elem => elem.name === "competitors_coordinates").map(elem => elem.value)}
                                                    center={center}
                                                    zoom={10}
                                                />
                                            </div>
                                        </>
                                    ) : null}

                                    <button onClick={handleEdit}>Edit Pricing Strategy</button>
                                </div>

                                <div className="flex-column-center-center station-prices-right">
                                    <div className="station-prices-chargers">
                                        <h5>Chargers in this Group</h5>
                                        <Link to={`/app/station-${id}/chargers`}>Edit Chargers</Link>
                                        <ul>
                                            {groups[groupSelected].chargers.map((charger) => {
                                                return (
                                                    <li key={charger.id}>{charger.name}</li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    
                                    <div className="station-prices-grid">
                                        <h5>Current Grid Price:</h5>
                                        {gridPrice2 ?
                                            <>
                                                <h3>{gridPrice2.price.toFixed(3)} €/KWh</h3>
                                                <h4>From: {gridPrice2.start_time}</h4>
                                                <h4>To: {gridPrice2.end_time}</h4>
                                                {/* diagram?? */}
                                            </>
                                        : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <GridPriceChart
                    gridPricesList={gridPricesList}
                />
            </div>
        </section>
        </div>

        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="my-modal-dialog"
            contentClassName="my-modal-content"
        >
            <>
                <Modal.Header className="modal-header">
                    <h1 className="modal-h1">Add a Pricing Method</h1>
                    <button onClick={handleClose} />
                </Modal.Header>
                <Modal.Body>
                    <div className="charger-inputs">

                        <div className="methods-info flex-column-center-center">
                            <Link target="_blank" to="/pricing-methods">
                                Which pricing method should I choose?
                            </Link>
                        </div>

                        <Select 
                            initialText="Select"
                            options={pricingMethods}
                            label="Select Pricing Method"
                            selected={pricingMethod}
                            setSelected={setPricingMethod}
                            width="80%"
                            error={pricingMethodError}
                            setError={setPricingMethodError}
                            tabIndex={0}
                            reset={[]}
                            setPrevSelected={setPrevPricingMethod}
                        />

                        {pricingMethod ? (
                            (pricingMethod === "Fixed Price")  ? (
                                <div className="fixed-price">
                                    <img className="function-image" src="/img/pricing_methods/fixed-price-method.png" alt="" />

                                    <div className="label-input">
                                        <h5>Set c</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constantError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant}
                                            onChange={(e) => setConstant(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (pricingMethod === "Fixed Profit")  ? (
                                <div className="fixed-profit">
                                    <img className="function-image" src="/img/pricing_methods/fixed-profit-method.png" alt="" />

                                    
                                    <div className="label-input">
                                        <h5>Set all_expenses calculation</h5>
                                    </div>
                                    <div className="flex-row-center-center margin-top-10">
                                        <button
                                            className="flex-row-center-center grid-price"
                                            onClick={() => {setGridPrice(!gridPrice);}}
                                        >
                                            Grid Price
                                            <div className="flex-row-center-center">
                                                {gridPrice ? (
                                                    <img src="/icons/check.png" alt="Check" />
                                                ) : (null)}
                                            </div>
                                        </button>
                                        <div className="plus-icon">
                                            +
                                        </div>
                                        
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (allExpensesError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={allExpenses}
                                            onChange={(e) => setAllExpenses(e.target.value)}
                                        />

                                    </div>
                                    {currentGridPrice ?
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KWh</span>
                                        </div>
                                    :null}
                                    
                                    <div className="label-input">
                                        <h5>Set c</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constantError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant}
                                            onChange={(e) => setConstant(e.target.value)}
                                        />
                                    </div>


                                </div>

                            ) : (pricingMethod === "Demand-centered Profit")  ? (
                                <div className="demand-centered">
                                    <img className="function-image" src="/img/pricing_methods/demand-centered-method.png" alt="" />
                                    
                                    <div className="label-input">
                                        <h5>Set all_expenses calculation</h5>
                                    </div>
                                    <div className="flex-row-center-center margin-top-10">
                                        <button
                                            className="flex-row-center-center grid-price"
                                            onClick={() => {setGridPrice(!gridPrice);}}
                                        >
                                            Grid Price
                                            <div className="flex-row-center-center">
                                                {gridPrice ? (
                                                    <img src="/icons/check.png" alt="Check" />
                                                ) : (null)}
                                            </div>
                                        </button>
                                        <div className="plus-icon">
                                            +
                                        </div>
                                        
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (allExpensesError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={allExpenses}
                                            onChange={(e) => setAllExpenses(e.target.value)}
                                        />

                                    </div>
                                    {currentGridPrice ?
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KWh</span>
                                        </div>
                                    :null}

                                    <div className="label-input">
                                        <h5>Set c1</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constantError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant}
                                            onChange={(e) => setConstant(e.target.value)}
                                        />
                                    </div>


                                    <div className="label-input">
                                        <h5>Set c2</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constant2Error ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant2}
                                            onChange={(e) => setConstant2(e.target.value)}
                                        />
                                    </div>


                                    <div className="input-with-help">
                                        <div className="label-input">
                                            <h5>Set n</h5>
                                            <input
                                                type="number"
                                                step="1"
                                                min="1"
                                                max="5"
                                                className={"my-classic-input" + " " + (nError ? "error-selected" : "")}
                                                placeholder="Set Constant"
                                                value={n}
                                                onChange={(e) => setN(e.target.value)}
                                            />
                                        </div>
                                        <p><span>Specify n to be an integer between 1 and 5.</span></p>
                                    </div>

                                    <div className="info-method">
                                        <p><span>Occupied</span> is how many chargers are currently occupied by vehicles. Currently, this value is 0. <br /><span>All_parking</span> is the number of all chargers.</p>

                                    </div>
                                </div>
                            ) : (pricingMethod === "Competitor-centered Profit")  ? (
                                <div className="competitor-centered">
                                    <img className="function-image" src="/img/pricing_methods/competitor-centered-profit-method.png" alt="" />

                                    <div className="label-input">
                                        <h5>Set all_expenses calculation</h5>
                                    </div>
                                    <div className="flex-row-center-center margin-top-10">
                                        <button
                                            className="flex-row-center-center grid-price"
                                            onClick={() => {setGridPrice(!gridPrice);}}
                                        >
                                            Grid Price
                                            <div className="flex-row-center-center">
                                                {gridPrice ? (
                                                    <img src="/icons/check.png" alt="Check" />
                                                ) : (null)}
                                            </div>
                                        </button>
                                        <div className="plus-icon">
                                            +
                                        </div>
                                        
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (allExpensesError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={allExpenses}
                                            onChange={(e) => setAllExpenses(e.target.value)}
                                        />

                                    </div>
                                    {currentGridPrice ?
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KWh</span>
                                        </div>
                                    :null}

                                    
                                    <div className="label-input">
                                        <h5>Set c1</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constantError ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant}
                                            onChange={(e) => setConstant(e.target.value)}
                                        />
                                    </div>


                                    <div className="label-input">
                                        <h5>Set c2</h5>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={"my-classic-input" + " " + (constant2Error ? "error-selected" : "")}
                                            placeholder="Set Constant"
                                            value={constant2}
                                            onChange={(e) => setConstant2(e.target.value)}
                                        />
                                    </div>

                                    <br />
                                    <div className="label-input">
                                        <h5>Select Competitors on the map below</h5>
                                    </div>
                                    <br />
                                    <section className="flex-row-center-center">
                                        <div className="map-div">
                                            { stationLocation && competitors && stationsMarkers ? (
                                                <Map3
                                                    marker={stationLocation}
                                                    competitors={competitors}
                                                    setCompetitors={setCompetitors}
                                                    // TODO: Find a better way to do this
                                                    markers={stationsMarkers.filter(elem => (elem.id !== stationLocation.id
                                                        && !competitors.map(elem => elem.id).includes(elem.id)))}
                                                    zoom={13}
                                                    center={center}
                                                />
                                            ) : null}
                                        </div>

                                        <div className="competitors-selected">
                                            <h3>Competitors Selected:</h3>
                                            {competitors.length ? (
                                                <ul>
                                                    {competitors.map(competitor => {
                                                        return (
                                                            <li key={competitor.id}>
                                                                <h5>{upTo(competitor.name, 20)}</h5>
                                                                <h6>{upTo(competitor.address, 25)}</h6>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            ) : (
                                                <h4>No competitors selected... Please select competitors on the map.</h4>
                                            )}
                                        </div>
                                    </section>

                                    <br />
                                    {competitorsError ?
                                            <p className="error-p">You need to select at least one competitor.</p>
                                            : null}
                                </div>
                            ): null
                        ) : null}
                        <br />
                        <br />
                        {pricingMethodError || constantError || allExpensesError || constant2Error || nError ?
                            <p className="error-p">Please correct the above errors to continue.</p>
                            : null}
                        
                    </div>
                    
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleSetPricingMethod}>
                        Save
                    </button>
                </Modal.Footer>
            </>
        </Modal>




    </>
    );
}
 
export default Prices;
