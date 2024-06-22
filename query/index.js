// Imports
const express = require('express');
const bodyParser = require('body-parser'); // To parse JSON correctly with requests and responses
const cors = require('cors'); // For enabling cross-origin requests

// Initialize the express app
const app = express();

// Set app features and middleware
app.use(bodyParser.json());
app.use(cors()); // TODO: set-up a domain-and-port whitelist file?

// ROLE: 
// This query is supposed to send all posts and all associated comments in a single response

// For storing the posts and comments mapping in memory
var postsAndComments = {}

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
app.listen(getAllPostsAndCommentsQueryPort, () => {
    console.log(`getAllPostsAndCommentsQuery Service is listening on port: ${getAllPostsAndCommentsQueryPort}`);
});
