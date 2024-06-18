// Imports
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON correctly with requests and responses
const {randomBytes} = require('crypto'); // used for generating random unique identifiers
const cors = require('cors'); // For enabling cross-origin requests

// Initialize the express app
const app = express();

// Set app features and middleware
app.use(bodyParser.json());
app.use(cors()); // TODO: set-up a domain-and-port whitelist file?

// Setting up Memory
// Note: For this simple project, we use local machine memory, or browser's storage
// This service will NOT persist data
const posts = {};

// Setting up Post APIs routes
// GET Routes
app.get('/posts', (req, res) => {
    // Send back all posts as part of response
    res.send(posts);
});

// Post Routes
app.post('/posts', (req, res) => {
    try{
        // Create a unique ID for the post
        const post_id = randomBytes(4).toString('hex');

        // Extract request data needed for post creation
        const {title} = req.body;

        // create the post
        posts[post_id] = {
            id: post_id, title
        }; 
        // send back a success status
        res.status(201).send(posts[post_id]);
    }
    catch (exception) {
        res.status(500).send(exception.toString());
    }
});

// Tie the service to a port
const port = 4000;
app.listen(port, ()=>{
    console.log(`Blog App's Post Service is listening on port: ${port}`);
});