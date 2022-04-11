export default {
    AC: {
        type: [
            "Type 1",
            "Type 2",
            "3-pin plug"
        ],
        power: {
            min_power: 0.2,
            maxPower: 1000
        }
    },
    DC: {
        type: [
            "CHAdeMO",
            "Combined Charging System (CCS)",
            "Type 2"
        ],
        power: {
            min_power: 0.2,
            maxPower: 1000
        }
    }
}
