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
        },
        2: {
            id: 2,
            name: "Random Station",
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
                current_price: 0.378,
                id: 1
            },
            {
                name: "50kW Chargers",
                current_price: 0.296,
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
