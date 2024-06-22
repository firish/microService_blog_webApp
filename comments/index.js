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

// Setting up Memory
// Note: For this simple project, we use local machine memory, or browser's storage
// This service will NOT persist data
const commentsByPostId = {};

// Setting up Post APIs routes
// GET Routes
app.get('/posts/:id/comments', (req, res) => {
    // Send back all posts as part of response
    try{
        const post_id = req.params.id;
        const post_comments = commentsByPostId[post_id] || [];
        res.send(post_comments);
    }
    catch (exception){
        res.status(404).send(exception.toString());
    }
    
});

// Post Routes
app.post('/posts/:id/comments', async (req, res) => {
    try{
        // Create a unique ID for the post
        const comment_id = randomBytes(4).toString('hex');

        // Extract request data needed for post creation
        const {content} = req.body;

        // Get the post associated with the request
        const post_id = req.params.id;
        const post_comments = commentsByPostId[post_id] || [];

        // create the comment
        // TODO: create a choice/constants file for all the different status
        post_comments.push({id: comment_id, content: content, status: "pending"});
        commentsByPostId[post_id] = post_comments;

        // Emit an event to the event bus
        // TODO: Create a logger dump file with timestamps? 
        console.log("Emitting commentCreated event to the event bus");
        await axios.post("http://localhost:4005/events", {
            type: "commentCreated", 
            data: {
                id: comment_id, 
                content: content,
                postId: post_id,
                status: "pending"
            }
        });

        // send back a success status
        res.status(201).send(post_comments);
    }
    catch (exception) {
        res.status(500).send(exception.toString());
    }
});

// Handle for received events (The service may/may not subscribe to the events)
app.post('/events', async (req, res) => {
    try{
        const {type, data} = req.body; 
        console.log(`The following event was receievd by the post service: ${type}`);

        // subscribe to commentModerated
        if (type === "commentModerated"){
            const {id, postId, status} = data;

            // Find the relevant comment
            let postComments = commentsByPostId[postId];
            let currentComment = postComments.find(comment => {
                return comment.id === id; 
            });

            // Update the status of the comment
            currentComment.status = status;
            
            // Emit this event to the event bus
            // Emit an event to the event bus
            // TODO: Create a logger dump file with timestamps? 
            console.log("Emitting commentUpdated event to the event bus");
            await axios.post("http://localhost:4005/events", {
                type: "commentUpdated", 
                data: {
                    id: data.id, 
                    content: data.content,
                    postId: data.postId,
                    status: status
                }
            });
        }

        // Send a OK response
        res.send({status: "OK"}); 
    }
    catch (exception){
        res.status(500).send(exception.toString());
    }
})

// Tie the service to a port
const port = 4001;
app.listen(port, ()=>{
    console.log(`Blog App's Comment Service is listening on port: ${port}`);
});