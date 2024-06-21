// Imports
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON correctly with requests and responses
const {randomBytes} = require('crypto'); // used for generating random unique identifiers
const cors = require('cors'); // For enabling cross-origin requests
const axios = require('axios'); // For making API requests

// Initialize the express app
const app = express();

// Set app features and middleware
app.use(bodyParser.json());
app.use(cors()); // TODO: set-up a domain-and-port whitelist file?

// Emitting Events
app.post('/events', async (req, res) => {
    try{ 
        const event = req.body;

        // Emit the event to every service
        // TODO: Really need to create the constants file with API endpoints
        // Note: This is a naive implementation that does not correctly deal with failing requests
        console.log(`---> Event received at event bus: ${JSON.stringify(event)}, and emitted to all micro-services`);
        await axios.post('http://localhost:4000/events', event);
        await axios.post('http://localhost:4001/events', event);
        await axios.post('http://localhost:4002/events', event);

        res.send({status: "OK"}); 
    }
    catch (exception){
        res.status(500).send({status: "Err", error: exception});
    }
});

// TODO: Move Service-Port Mapping to a global constants/network file
const event_bus_port = 4005;
app.listen(event_bus_port, () => {
    console.log(`Event Bus Service is listening on port: ${event_bus_port}`);
});

