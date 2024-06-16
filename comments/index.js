// Imports
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON correctly with requests and responses
const {randomBytes} = require('crypto'); // used for generating random unique identifiers

// Initialize the express app
const app = express();

// Set app features and middleware
app.use(bodyParser.json());

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
app.post('/posts/:id/comments', (req, res) => {
    try{
        // Create a unique ID for the post
        const comment_id = randomBytes(4).toString('hex');

        // Extract request data needed for post creation
        const {content} = req.body;

        // Get the post associated with the request
        const post_id = req.params.id;
        const post_comments = commentsByPostId[post_id] || [];

        // create the comment
        post_comments.push({id: comment_id, content});
        commentsByPostId[post_id] = post_comments;

        // send back a success status
        res.status(201).send(post_comments);
    }
    catch (exception) {
        res.status(500).send(exception.toString());
    }
});

// Tie the service to a port
const port = 4001;
app.listen(port, ()=>{
    console.log(`Blog App's Comment Service is listening on port: ${port}`);
});