const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const SERP_API_KEY = "0de07f7453a2611da9f7d4b0baafca26559ce34ac9618bad87f55ea4bbf23a79";

// Flight API Endpoint
// This endpoint fetches flight data based on origin, destination, and date
app.get("/api/flights", async (req, res) => {
    try {
        const { origin, destination, date } = req.query;
        if (!origin || !destination || !date) {
            return res.status(400).json({
                error: "Missing required parameters",
                message: "Please provide origin, destination, and date parameters"
            });
        }

//
        const serpApiUrl = `https://serpapi.com/search?engine=google_flights&departure_id=${origin}&arrival_id=${destination}&outbound_date=${date}&type=2&currency=USD&api_key=${SERP_API_KEY}`;
        const response = await axios.get(serpApiUrl);


        let flights = [];
        if (response.data.best_flights) {
            flights = [...flights, ...response.data.best_flights.map(processFlight)];
        }

        if (response.data.other_flights) {
            flights = [...flights, ...response.data.other_flights.map(processFlight)];
        }



        function processFlight(flight) {
            const firstFlight = flight.flights[0];

            return {
                id: flight.booking_token || Date.now().toString(),

                airline: firstFlight.airline,
                airlineLogo: flight.airline_logo,
                flightNumber: firstFlight.flight_number,
                departureTime: firstFlight.departure_airport.time,
                arrivalTime: firstFlight.arrival_airport.time,
                departureAirport: firstFlight.departure_airport.name,
                arrivalAirport: firstFlight.arrival_airport.name,
                duration: flight.total_duration,
                price: flight.price,
                airplane: firstFlight.airplane,
                travelClass: firstFlight.travel_class,
                legroom: firstFlight.legroom,
                carbonEmissions: flight.carbon_emissions?.this_flight ?
                flight.carbon_emissions.this_flight / 1000 : 0,
                extensions: flight.extensions || []
            };
        }

            res.json({
            success: true,
            flights
        });

    } catch (error) {

        console.error("Flight API Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch flights",
            details: error.message,
            message: "Please try later"
        });
    }
});


// Hotel API Endpoint
// This endpoint fetches hotel data based on location, check-in, check-out dates, and number of guests
app.get("/api/hotels", async (req, res) => {
    try {

        const { location, checkIn, checkOut, guests } = req.query;
            if (!location || !checkIn || !checkOut) {
            return res.status(400).json({
                error: "Missing required parameters",
                message: "Please provide location, checkIn, and checkOut parameters"
            });
        }


        const serpApiUrl = `https://serpapi.com/search.json?engine=google_hotels&q=${encodeURIComponent(location)}&check_in_date=${checkIn}&check_out_date=${checkOut}&adults=${guests || 2}&currency=USD&gl=us&hl=en&api_key=${SERP_API_KEY}`;
        const response = await axios.get(serpApiUrl);


        let hotels = [];
            if (response.data.properties) {
            hotels = response.data.properties.map(hotel => ({
                    ...hotel,

            }));
        }

            res.json({
            success: true,
            hotels
        });

    } catch (error) {
        console.error("Hotel API Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to fetch hotels",
            details: error.message,
            message: "Please try later"
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});