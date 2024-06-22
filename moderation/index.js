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
// This moderation service is supposed to moderate the content of all services
// For the purpose of this application, it will block any comment that has the fruit orange in it
// But it aims to mimic a real life blog system, where some moderators will be manually flagging comments as trolling/hate speech
// Since this is manual, it may take hours, if not days
// So we build our app in a way that allows us to handle this situation

// API Endpoints
// Dealing with events emitted by the event-bus
app.post('/events', async (req, res) => {
    try{
        // get the event type
        const {type, data} = req.body;
        console.log(`The following event was receievd by the moderation service: ${type}`);

        // subscribe to commentCreated event
        if (type == "commentCreated"){
            const status = data.content.includes('orange')? "rejected": "accepted";

            // Emit an event to the event bus
            // TODO: Create a logger dump file with timestamps? 
            console.log("Emitting commentModerated event to the event bus");
            await axios.post("http://localhost:4005/events", {
                type: "commentModerated", 
                data: {
                    id: data.id, 
                    content: data.content,
                    postId: data.postId,
                    status: status
                }
            });
        }
        res.send(data);
    }
    catch (exception){
        res.status(500).send(exception);
    }
});


// TODO: Move Service-Port Mapping to a global constants/network file
const moderateCommentsServicePort = 4003;
app.listen(moderateCommentsServicePort, () => {
    console.log(`moderateComments Service is listening on port: ${moderateCommentsServicePort}`);
});
