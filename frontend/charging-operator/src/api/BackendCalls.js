export const getMarkers = () => {
    // TODO: Hit backend
    // temporarily return this list
    return [{
        lat: 37.979188,
        lng: 23.783088,
        title: "ECE charger",
        address: "Iroon Politechniou 21",
        id: 1
    },
    {
        lat: 37.98,
        lng: 23.782,
        title: "Other Charger 1",
        address: "Iroon Politechniou 123",
        id: 2
    },
    {
        lat: 37.97,
        lng: 23.79,
        title: "12345678901234567890123456789012345",
        address: "Iroon Politechniou 456",
        id: 3
    },
    {
        lat: 37.976,
        lng: 23.787,
        title: "NTUA General Charger",
        address: "Iroon Politechniou 23",
        id: 4
    },
    {
        lat: 37.97,
        lng: 23.77,
        title: "Other Charger 1",
        address: "Iroon Politechniou 78",
        id: 5
    },
    {
        lat: 37.976,
        lng: 23.76,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 6
    },
    {
        lat: 37.95,
        lng: 23.72,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 7
    },
    {
        lat: 37.95,
        lng: 23.73,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 8
    },
    {
        lat: 37.96,
        lng: 23.72,
        title: "Other Charger 2",
        address: "Iroon Politechniou 90",
        id: 9
    }];
}

export const getGridPrice = () => {
    // TODO: Hit backend
    // temporarily return this object
    return {
        "grid_price": 0.158
    };
}

export const createStation = () => {
    // TODO: Hit backend
    // temporarily return station added successfully
    return {ok: true, errors: null};
}

export const getStation = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: {
            id: 1,
            name: "Ntua Charging Station",
            location: {
                lat: 37.98,
                lng: 23.783088
            }
        },
        2: {
            id: 2,
            name: "Random Station",
            location: {
                lat: 37.979188,
                lng: 23.783088,
            }
        }
    }

    return id in stations ? stations[id] : stations[1];
}

export const getStationChargers = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: [
            {
                name: "22kW Chargers",
                total_count: 5,
                taken: 4,
                id: 1
            },
            {
                name: "50kW Chargers",
                total_count: 2,
                taken: 1,
                id: 2
            }
        ]
    }

    return id in stations ? stations[id] : stations[1];
}

export const getStationPrices = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: [
            {
                name: "22kW Chargers",
                current_price: 0.296,
                id: 1
            },
            {
                name: "50kW Chargers",
                current_price: 0.378,
                id: 2
            }
        ]
    }

    return id in stations ? stations[id] : stations[1];
}

export const getStationVehicles = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: [
            {
                model: "Tesla Model 3",
                licence_plate: "AHB 2879",
                expected_departure: "04/05/2022 17:55",
                charging_in: "50 kW Charger 1",
                id: 1
            },
            {
                model: "Hyundai Kona Electric",
                licence_plate: "KPH 3421",
                expected_departure: "04/05/2022 18:20",
                charging_in: "22 kW Charger 5",
                id: 2
            },
            {
                model: "Nissan Leaf",
                licence_plate: "INB 8945",
                expected_departure: "04/05/2022 18:35",
                charging_in: "22 kW Charger 4",
                id: 3
            },
            {
                model: "Tesla Model S",
                licence_plate: "KRH12HE",
                expected_departure: "04/05/2022 18:45",
                charging_in: "22 kW Charger 1",
                id: 4
            },
            {
                model: "Tesla Model 3",
                licence_plate: "OII 4312",
                expected_departure: "04/05/2022 19:05",
                charging_in: "22 kW Charger 2",
                id: 5
            },
        ]
    }

    return id in stations ? stations[id] : stations[1];
}

export const getStationReservations = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: {
            next_12_hours: [
                {
                    model: "Tesla Model 3",
                    owner: "Antonios Kalogiorgos",
                    licence_plate: "AOB 1212",
                    expected_arrival: "04/05/2022 18:05",
                    expected_departure: "04/05/2022 18:30",
                    charging_in: "50 kW Charger 1",
                    id: 1
                },
                {
                    model: "Tesla Model X",
                    owner: "Konstantina Papadopoulou",
                    licence_plate: "HNB 3779",
                    expected_arrival: "04/05/2022 18:10",
                    expected_departure: "04/05/2022 19:45",
                    charging_in: "22 kW Charger 2",
                    id: 2
                }
            ],
            next_24_hours: [
                {
                    model: "Tesla Model X",
                    owner: "Konstantinos Georgiou",
                    licence_plate: "HNK 8967",
                    expected_arrival: "05/05/2022 10:05",
                    expected_departure: "05/05/2022 10:30",
                    charging_in: "50 kW Charger 1",
                    id: 1
                }
            ]
        }
    }

    return id in stations ? stations[id] : stations[1];
}

export const getPricingGroups = async (id) => {
    // TODO: Hit backend
    // temporarily return this dict
    const stations = {
        1: {
            1: {
                name: "22kW Chargers",
                current_price: 0.296,
                chargers: [
                    {
                        name: "Charger name 1",
                        current: "AC",
                        connector_type: "Type 1",
                        power: 22,
                        id: 1
                    },
                    {
                        name: "Charger name 2",
                        current: "AC",
                        connector_type: "Type 1",
                        power: 21.9,
                        id: 2
                    },
                    {
                        name: "Charger name 3",
                        current: "AC",
                        connector_type: "3-pin plug",
                        power: 22,
                        id: 3
                    },
                    {
                        name: "Charger name 4",
                        current: "AC",
                        connector_type: "Type 2",
                        power: 22.4,
                        id: 4
                    },
                    {
                        name: "Charger name 5",
                        current: "AC",
                        connector_type: "Type 2",
                        power: 22,
                        id: 5
                    }
                ],
                pricing_method: {
                    name: "Demand-centered Profit",
                    variables: [
                        {
                            name: "all_expenses",
                            id: 1,
                            value: 0.1
                        },
                        {
                            name: "grid_price",
                            id: 2,
                            value: true
                        },
                        {
                            name: "c1",
                            id: 3,
                            value: 0.12
                        },
                        {
                            name: "c2",
                            id: 4,
                            value: 0.13
                        },
                        {
                            name: "n",
                            id: 5,
                            value: 2
                        }
                    ]
                },
                id: 1
            },
            2: {
                name: "50kW Chargers",
                current_price: 0.378,
                chargers: [
                    {
                        name: "Charger name 1",
                        current: "DC",
                        connector_type: "Type 2",
                        power: 48.8,
                        id: 1
                    },
                    {
                        name: "Charger name 2",
                        current: "DC",
                        connector_type: "Combined Charging System (CCS)",
                        power: 50,
                        id: 2
                    }
                ],
                pricing_method: {
                    name: "Competitor-centered Profit",
                    variables: [
                        {
                            name: "all_expenses",
                            id: 1,
                            value: 0.1
                        },
                        {
                            name: "grid_price",
                            id: 2,
                            value: true
                        },
                        {
                            name: "c1",
                            id: 3,
                            value: 0.13
                        },
                        {
                            name: "competitors_coordinates",
                            id: 4,
                            value: [
                                {
                                    lat: 37.979188,
                                    lng: 23.783088,
                                    title: "ECE charger",
                                    address: "Iroon Politechniou 21",
                                    id: 1
                                },
                                {
                                    lat: 37.98,
                                    lng: 23.782,
                                    title: "Other Charger 1",
                                    address: "Iroon Politechniou 123",
                                    id: 2
                                }
                            ]
                        },
                        {
                            name: "c2",
                            id: 5,
                            value: 0.15
                        }
                    ]
                },
                id: 2
            }
        }
    }

    return id in stations ? stations[id] : stations[1];
}

export const getGridPrices = async () => {
    // TODO: Hit backend
    // temporarily return this dict
    const grid_price = {
        grid_price: 0.189,
        previous_values: [
            {
                date: "19/05/2022 18:00",
                price: 0.179
            },
            {
                date: "19/05/2022 17:45",
                price: 0.172
            },
            {
                date: "19/05/2022 17:30",
                price: 0.177
            }
        ]
    }

    return grid_price;
}

export const updatePricingGroup = async (stationId, groupId) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const deleteCharger = async (chargerId) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const addChargerGroup = async (groupName) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const updateCharger = async (chargerId) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const createCharger = async () => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const getAvailableChargers = async (stationId, arrivalTime, departureTime) => {
    // TODO: Hit backend
    // temporarily return this list
    return [
        {
            name: "Charger 1",
            group: "22kW Chargers",
            expected_price: 9.88,
            id: 1
        }
    ];
}

export const addReservation = async (reservation_dict) => {
    // TODO: Hit backend
    // temporarily return this dict
    return {ok: true, errors: null};
}

export const getReservations = async (startingArrival, endingArrival,
                                    startingDeparture, endingDeparture) => {
    // TODO: Hit backend
    // temporarily return this list
    return [
        {
            owner: "Markos Kostogiannis",
            expected_arrival: "19/07/2022 12:00",
            expected_departure: "19/07/2022 12:40",
            charger: "Charger 1",
            state: "Completed",
            id: 1
        }
    ];
}
