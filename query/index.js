// Imports
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON correctly with requests and responses
const cors = require('cors'); // For enabling cross-origin requests
const axios = require('axios'); 

// Initialize the express app
const app = express();

// Set app features and middleware
app.use(bodyParser.json());
app.use(cors()); // TODO: set-up a domain-and-port whitelist file?

// ROLE: 
// This query is supposed to send all posts and all associated comments in a single response

// For storing the posts and comments mapping in memory
var postsAndComments = {}

// Helper functions
// Function helps process incoming events received by the event-bus
const handleEvent = (type, event) => {
    // Subscribe to postCreated Event
    if (type === "postCreated"){
        const {id, title} = data;
        postsAndComments[id] = {id, title, comments: []};
    }

    // Subscribe to commentCreated Event
    if (type === "commentCreated"){
        let {id, content, postId, status} = data;
        postsAndComments[postId].comments.push({id, content, status});
    }

    // Subscribe to commentUpdated Event
    if (type === "commentUpdated"){
        let {id, content, postId, status} = data;
        let postComments = postsAndComments[postId].comments;
        let currentComment = postComments.find(comment => {
            return comment.id === id; 
        });

        // Update the entire current comment
        currentComment.content = content;
        currentComment.status = status;
    }
}

// APIs
app.get('/posts', (req, res) => {
    try{
        res.send(postsAndComments);
    }
    catch (exception){
        res.status(500).send(exception);
    }
});

app.post('/events', (req, res) => {
    try{
        const {type, data} = req.body;
        console.log(`The following event was receievd by the query service: ${type}`);

        // Handle the incoming event (or skip it, if unsubscribed to that event)
        handleEvent(type, data);

        // Note: sending the entire object for ease of testing and debugging,
        // Before build, change this to send just an 'OK' response.
        res.send(postsAndComments);
    }
    catch (exception){
        console.log("exception ::: ", exception);
        res.status(500).send(exception);
    }
});

// TODO: Move Service-Port Mapping to a global constants/network file
const getAllPostsAndCommentsQueryPort = 4002;
app.listen(getAllPostsAndCommentsQueryPort, async () => {
    console.log(`getAllPostsAndCommentsQuery Service is listening on port: ${getAllPostsAndCommentsQueryPort}`);

    // [IMPORTANT]
    // If this service ever crashes out
    // We need to sync it with the event bus every time it comes up online.
    // Note: This is a very naive way of syncing up.
    // In a prod application,
    // where data is being written to a db,
    // we would assign a timestamp, and a unique id to all the events
    // In each service that subscribes to an event, we should store the id of that processed event
    // Then when the service come up again, we find the service's last executed event in the event bus,
    // And then sequentially walk through all the other events, and consume the ones of interest.
    // This is how our application will guarantee eventual consistency! 
    try{
        let res = await axios.get("http://localhost:4005/events");
        // process any missing events
        for (let event of res.data){
            console.log("Event bus event: ", event.type);
            handleEvent(event.type, event.data); 
        }
    } 
    catch (exception){
        console.log("Exception while syncing up the query service to the event bus: ", exception);
    }
});
