const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Flight = require('./models/flightModel');
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Utility function to convert m/d/y to yyyy-mm-dd
function convertDateFormat(dateStr) {
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return dateStr; // Already in yyyy-mm-dd format
    }
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Fetch all flights with optional query parameters
app.get('/flights', async (req, res) => {
    const { origin, destination, date, maxPrice } = req.query;
    try {
        const query = {};

        if (origin) query.origin = new RegExp(origin, 'i');
        if (destination) query.destination = new RegExp(destination, 'i');
        if (date) query.date = { $eq: new Date(convertDateFormat(date)) };
        if (maxPrice) query.price = { $lte: maxPrice };

        const flights = await Flight.find(query);
        res.status(200).json(flights);
    } catch (error) {
        console.error('Error fetching flights:', error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Fetch flight by ID
app.get('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(flight);
    } catch (error) {
        console.error('Error fetching flight by ID:', error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Add a new flight
app.post('/flights', async (req, res) => {
    try {
        const { name, seats, price, origin, destination, date } = req.body;
        const formattedDate = convertDateFormat(date);

        const newFlight = new Flight({
            name,
            seats,
            price,
            origin,
            destination,
            date: new Date(formattedDate)
        });

        await newFlight.save();
        res.status(201).json(newFlight);
    } catch (error) {
        console.error('Error adding new flight:', error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Update an existing flight
app.put('/flights/:id', async (req, res) => {
    try {
        const { name, seats, price, origin, destination, date } = req.body;
        const formattedDate = convertDateFormat(date);

        const updatedFlight = await Flight.findByIdAndUpdate(
            req.params.id,
            {
                name,
                seats,
                price,
                origin,
                destination,
                date: new Date(formattedDate)
            },
            { new: true }
        );

        if (!updatedFlight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(updatedFlight);
    } catch (error) {
        console.error('Error updating flight:', error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// Delete a flight
app.delete('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Error deleting flight:', error.stack);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

// MongoDB connection
mongoose.set("strictQuery", false);
mongoose.connect('mongodb+srv://KawsarAlamkhan:123Jahin@cluster0.equ9p.mongodb.net/WITCON-API?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB...');
        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    })
    .catch(err => console.error('Could not connect to MongoDB...', err));
