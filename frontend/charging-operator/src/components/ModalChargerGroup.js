import { useEffect, useState } from "react";
import { Modal } from 'react-bootstrap';
import '../bootstrap.css';
import { useAlert } from 'react-alert';

import Select from "./Select/Select";
import Map3 from "./Map3/Map";
import { createPricingGroup, deletePricingGroup, getGridPrice, getMarkers, updatePricingGroup } from "../api/BackendCalls";
import AuthProvider from "../context/AuthProvider";
import { Link } from "react-router-dom";
import { upTo } from "../utils/usefulFunctions";


const GROUP_NAME_REGEX = /^[A-z0-9_\ ]{3,23}$/;


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


const ModalChargerGroup = ({show, setShow, station, marker, zoom, center, pricingMethod, setPricingMethod,
                            groupName, setGroupName, prevPricingMethod, setPrevPricingMethod,
                            allExpenses, setAllExpenses, gridPrice, setGridPrice, constant, setConstant,
                            constant2, setConstant2, n, setN, competitors, setCompetitors,
                            chargerGroups, setChargerGroups, groupId, initializeFetchedData}) => {

    const alert = useAlert();

    const { grid_price: currentGridPrice } = getGridPrice();
    const { getAuth } = AuthProvider();

    const [stationsMarkers, setStationsMarkers] = useState([]);

    const [groupNameError, setGroupNameError] = useState(false);
    const [pricingMethodError, setPricingMethodError] = useState(false);
    const [constantError, setConstantError] = useState(false);
    const [allExpensesError, setAllExpensesError] = useState(false);
    const [constant2Error, setConstant2Error] = useState(false);
    const [nError, setNError] = useState(false);
    const [competitorsError, setCompetitorsError] = useState(false);

    useEffect(async () => {
        const mark = await getMarkers(getAuth());
        setStationsMarkers(mark);
    }, [])
    const handleClose = () => {
        setShow(false);
        initializeInputState();
    }

    const handleDelete = async () => {
        const data = await deletePricingGroup(getAuth(), station.id, {
            id: groupId
        });
        if (data.ok) {
            setShow(false);
            alert.success('Pricing Group deleted successfully!');
            initializeInputState();
            initializeFetchedData();
        }
        else {
            console.log("Something went wrong while deleting Pricing Group");
        }
    }

    const handleCreateChargerGroup = async () => {
        let group = {};
        group["id"] = groupId;

        if (!GROUP_NAME_REGEX.test(groupName)) {
            setGroupNameError(true);
            return;
        }
        group["name"] = groupName;

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

            group["pricing_method"] = {
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

            group["pricing_method"] = {
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

            group["pricing_method"] = {
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

            group["pricing_method"] = {
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

        if (groupId === null) {
            const data = await createPricingGroup(getAuth(), station.id, group);
            if (data.ok) {
                alert.success('Pricing Group created successfully!');
                setShow(false);
                initializeInputState();
                initializeFetchedData();
            }
            else {
                console.log("Something went wrong while creating Pricing Group");
            }
        }
        else {
            const data = await updatePricingGroup(getAuth(), station.id, group);
            if (data.ok) {
                setShow(false);
                alert.success('Pricing Group updated successfully!');
                initializeInputState();
                initializeFetchedData();
            }
            else {
                console.log("Something went wrong while updating Pricing Group");
            }
        }

    }

    const initializeInputState = () => {
        setGroupName("");
        setPricingMethod("");
        setConstant("");
        setAllExpenses("");
        setConstant2("");
        setN("");
        setCompetitors([]);
        setGroupNameError(false);
        setPricingMethodError(false);
        setConstantError(false);
        setAllExpensesError(false);
        setConstant2Error(false);
        setNError(false);
        setCompetitorsError(false);
    }

    useEffect(() => {
        setGroupNameError(false);
        setPricingMethodError(false);
        setConstantError(false);
        setAllExpensesError(false);
        setConstant2Error(false);
        setNError(false);
        setCompetitorsError(false);
    }, [groupName, pricingMethod, constant, allExpenses, constant2, n, competitors])

    useEffect(() => {
        if (prevPricingMethod !== "") {
            setConstant("");
            setAllExpenses("");
            setConstant2("");
            setN("");
            setCompetitors([]);
        }
    }, [pricingMethod])
    

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            dialogClassName="my-modal-dialog"
            contentClassName="my-modal-content"
        >
            <Modal.Header  className="modal-header">
                <h1 className="modal-h1">Create Pricing Group</h1>
            </Modal.Header>

            <Modal.Body>
                <div className="charger-inputs">
                    <div className="input-with-help">
                        <div className="label-input">
                            <h5>Pricing Group's Name</h5>
                            <input
                                type="text"
                                className={"my-classic-input" + " " + (groupNameError ? "error-selected" : "")}
                                placeholder="Input Pricing Group's name"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        {groupNameError ? <p className="error-p">Specify a name for your Pricing Group. 2-32 characters and can include letters, numbers, spaces and underscores.</p> : null}
                    </div>

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
                                        onClick={() => {setGridPrice(!gridPrice)}}
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
                                            + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/kWh</span>
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
                                            + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/kWh</span>
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
                                    <p><span>Occupied</span> is how many chargers are currently occupied by vehicles. Currently, this value is 0. <br /><span>All_parking</span> is the number of all chargers in this group.</p>

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
                                            + ( allExpenses ? parseFloat(allExpenses): 0)).toFixed(4)} €/kWh</span>
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
                                        <Map3
                                            marker={marker}
                                            competitors={competitors}
                                            setCompetitors={setCompetitors}
                                            markers={stationsMarkers}
                                            zoom={zoom}
                                            center={center}
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
                <>
                    {groupId === null ? (null) : (
                        <button className="delete-charger" onClick={handleDelete}>
                            Delete Pricing Group
                        </button>
                    )}
                    <button className="cancel-charger" onClick={handleClose}>
                        Cancel
                    </button>
                    <button className="submit-charger" onClick={handleCreateChargerGroup}>
                        {groupId === null ?  "Create Pricing Group" : "Update Pricing Group"}
                    </button>
                </>
            </Modal.Footer>
        </Modal>
    );
}
 
export default ModalChargerGroup;
