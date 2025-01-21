const express = require('express');
const mongoose = require('mongoose');
const Flight = require('./models/flightModel');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/flights', async (req, res) => {
    try {
        const flights = await Flight.find({});
        res.status(200).json(flights);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

app.get('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findById(req.params.id);
        res.status(200).json(flight);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});



app.post('/flights', async (req, res) => {
    try {
        const flight = await Flight.create(req.body);
        res.status(200).json(flight);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });

    }
});
// Update a flight
app.put('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
        // If the flight does not exist
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(flight);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});

//Delete a flight
app.delete('/flights/:id', async (req, res) => {
    try {
        const flight = await Flight.findByIdAndDelete(req.params.id);
        // If the flight does not exist
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
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