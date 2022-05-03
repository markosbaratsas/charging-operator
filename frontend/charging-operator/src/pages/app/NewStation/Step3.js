import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';

import Select from "../../../components/Select/Select";
import { getGridPrice, getMarkers } from "../../../api/BackendCalls";
import Map from "../../../components/Map3/Map";
import { upTo } from "../../../utils/usefulFunctions";
import AuthProvider from "../../../context/AuthProvider";

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


const Step3 = ({chargers, setChargers, chargerGroups, setChargerGroups, setStep,
                zoom, setZoom, center, setCenter, marker, setMarker}) => {
    const { getAuth } = AuthProvider();
    const [stationsMarkers, setStationsMarkers] = useState([]);

    const [gridPrice, setGridPrice] = useState(true);
    const { grid_price: currentGridPrice } = getGridPrice();

    const [groupId, setGroupId] = useState(null);
    const [errorNextStep, setErrorNextStep] = useState(false);

    const [show, setShow] = useState(false);

    const [pricingMethod, setPricingMethod] = useState("");
    const [pricingMethodError, setPricingMethodError] = useState(false);

    // used to initialize the rest of the input when precing method is changing
    const [prevPricingMethod, setPrevPricingMethod] = useState("");

    const [constant, setConstant] = useState("");
    const [constantError, setConstantError] = useState(false);

    const [allExpenses, setAllExpenses] = useState("");
    const [allExpensesError, setAllExpensesError] = useState(false);

    const [constant2, setConstant2] = useState("");
    const [constant2Error, setConstant2Error] = useState(false);

    const [n, setN] = useState("");
    const [nError, setNError] = useState(false);

    const [competitors, setCompetitors] = useState([]);
    const [competitorsError, setCompetitorsError] = useState(false);

    useEffect(async () => {
        const mark = await getMarkers(getAuth());
        setStationsMarkers(mark);
    }, [])

    const handleEdit = (group_id) => {
        let this_group = chargerGroups.find(g => g.id === group_id);
        console.log(this_group);
        if (!this_group) return;

        setGroupId(this_group.id);
        initializeInputState();

        // needed to have the expected behavior
        setPrevPricingMethod("");

        if ("pricing_method" in this_group) {
            setPricingMethod(this_group["pricing_method"].name);
            for (let i=0; i<this_group["pricing_method"].variables.length; i++) {
                let v = this_group["pricing_method"].variables[i];
                if (v.name === "c" || v.name === "c1") setConstant(v.value);
                if (v.name === "all_expenses") setAllExpenses(v.value);
                if (v.name === "grid_price") setGridPrice(v.value);
                if (v.name === "c2") setConstant2(v.value);
                if (v.name === "n") setN(v.value);
                if (v.name === "competitors_coordinates") setCompetitors(v.value);
            }
        }
        setShow(true);
    }
    const handleSetPricingMethod = () => {
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

            let newChargerGroups = chargerGroups.slice();
            let i = newChargerGroups.findIndex(g => (g.id === groupId));
            newChargerGroups[i]["pricing_method"] = {
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
            setChargerGroups(newChargerGroups);
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

            let newChargerGroups = chargerGroups.slice();
            let i = newChargerGroups.findIndex(g => (g.id === groupId));
            newChargerGroups[i]["pricing_method"] = {
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
            setChargerGroups(newChargerGroups);
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

            let newChargerGroups = chargerGroups.slice();
            let i = newChargerGroups.findIndex(g => (g.id === groupId));
            newChargerGroups[i]["pricing_method"] = {
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
            setChargerGroups(newChargerGroups);
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

            let newChargerGroups = chargerGroups.slice();
            let i = newChargerGroups.findIndex(g => (g.id === groupId));
            newChargerGroups[i]["pricing_method"] = {
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
            setChargerGroups(newChargerGroups);
        }

        setShow(false);
        initializeInputState();
    }
    const handleClose = () => {
        initializeInputState();
        setShow(false);
    }
    const moveToStep2 = () => {
        setStep(2);
    }
    const moveToStep4 = () => {
        let ok = true;
        for (let i=0; i<chargerGroups.length; i++) {
            if (chargerGroups[i].name !== "... Add a new Charger Group"
                    && !("pricing_method" in chargerGroups[i])) {
                setErrorNextStep(true);
                ok = false;
            }
        }

        if (ok) setStep(4);
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
        setErrorNextStep(false);
    }, [pricingMethod, constant, allExpenses, constant2, n, competitors])

    useEffect(() => {
        console.log(prevPricingMethod)
        if (prevPricingMethod !== "") {
            setConstant("");
            setAllExpenses("");
            setConstant2("");
            setN("");
            setCompetitors([]);
        }
    }, [pricingMethod])

    return (
        <div className="full-width flex-column-center-center">
            <div className="step2">
                <h3>Set Pricing Methods</h3>
                <div className="chargers-list">

                    {chargerGroups.filter(group => group.name !==  "... Add a new Charger Group").map(group => {
                        return (
                            <div
                                key={group.id}
                                className="group"
                            >
                                <div className="group-info">
                                    <h2>{ group.name.length < 22 ? group.name
                                            : `${group.name.substring(0,22)} ...` }</h2>

                                    <p>Chargers in this group:&#160;
                                        {chargers.filter((charger) => charger.charger_group ===  group.name).map((charger, index) => {
                                            return (
                                                <span key={charger.id} className="inline-div">
                                                    {/* not the best way to write this... but... :) */}
                                                    {charger.charger_name + (((chargers.filter((charger) => charger.charger_group ===  group.name).length) !== index+1) ? "," : "" )}&#160;
                                                </span>
                                            )
                                        })}
                                    </p>

                                    {"pricing_method" in group ?  (
                                        <div className="pricing-method-info">
                                            <h4>Pricing Method: <span>{group.pricing_method.name}</span></h4>
                                            <ul>
                                                {group.pricing_method.variables.filter(elem => (
                                                        elem.name !== "competitors_coordinates"
                                                        && elem.name !== "grid_price"
                                                    )).map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>{elem.name}: <span>{elem.value}</span></p>
                                                        </li>
                                                    );
                                                })}
                                                {group.pricing_method.variables.filter(elem => elem.name === "competitors_coordinates").map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>Number of competitors selected: <span>{elem.value.length}</span></p>
                                                        </li>
                                                    );
                                                })}
                                                {group.pricing_method.variables.filter(elem => elem.name === "grid_price").map(elem => {
                                                    return (
                                                        <li key={elem.id}>
                                                            <p>Grid Price: <span>{elem.value ? "Yes" : "No"}</span></p>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div>
                                            <h3>No pricing method is set.</h3>
                                        </div>
                                    )}

                                    

                                </div>
                                <div className="flex-column-center-center">
                                    <button
                                        onClick={() => handleEdit(group.id)}
                                    >
                                        {"pricing_method" in group ? 
                                            "Edit Pricing method"
                                            : "Select Pricing Method"
                                        }
                                    </button>
                                </div>
                                
                            </div>

                        );
                    })}
                   

                   
                </div>

                {errorNextStep ?
                    <div className="error-next-step">
                        <p className="error-p">You need to add pricing methods to all groups in order to continue.</p>
                    </div>
                 : null}

                <div className="steps-buttons">
                
                    <button 
                        className="back-step flex-row-center-center"
                        onClick={moveToStep2}
                    >
                        <img src="/icons/left-arrow.png" alt="" />
                    </button>
                    
                    <button 
                        className="next-step flex-row-center-center"
                        onClick={moveToStep4}
                    >
                        New Station Overview
                        <img src="/icons/right-arrow.png" alt="" />
                    </button>

                </div>
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
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KW</span>
                                        </div>
                                        
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
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KW</span>
                                        </div>

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
                                            <p><span>Occupied</span> is how many chargers are currently occupied by vehicles. Currently, this value is 0. <br /><span>All_parking</span> is the number of all chargers. Currently this value is {chargers.length}</p>

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
                                        <div className="all-expenses-calc">
                                            Current expenses calculation: {" "}
                                            <span>{parseFloat(( gridPrice ? parseFloat(currentGridPrice) : 0)
                                                    + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/KW</span>
                                        </div>

                                        
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
                                                <Map
                                                    marker={marker}
                                                    competitors={competitors}
                                                    setCompetitors={setCompetitors}
                                                    markers={stationsMarkers}
                                                    zoom={zoom}
                                                    setZoom={setZoom}
                                                    center={center}
                                                    setCenter={setCenter}
                                                />
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




        </div>
    );
}
 
export default Step3;
