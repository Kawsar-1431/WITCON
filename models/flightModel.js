const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter the name of the flight"]
        },
        seats: {
            type: Number,
            required: [true, "Please enter the number of seats"]
        },
        price: {
            type: Number,
            required: [true, "Please enter the price of the flight ticket"]
        },
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        date: {
            type: Date,  // Store as a Date type
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;
