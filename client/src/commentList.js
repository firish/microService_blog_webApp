// Imports
import React, {useState, useEffect} from 'react';
import axios from 'axios';

// React Component
const CommentListComponent = ({postId}) => {
    // Setting up the react hooks for this component
    const [comments, setComments] = useState([]);

    // Component API requests
    const fetchComments = async () => {
        try {
            // Make the GET API request
            // TODO: Create a constant file for API endpoints?
            const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
            setComments(res.data);
        } catch (exception) {
            // TODO: Create a constants file with error codes?
            alert(`Service Error: ${exception.message}`);
        }
    };

    // Set up useEffect, to only run fetchComments one time (onLoad)
    useEffect(() => {
        fetchComments();
    }, []); 

    // Display cards for each retrieved post
    const renderedComments = comments.map(comment => {
        return (
            <li key={comment.id}>{comment.content}</li>
        );
    });

    // The CommentList component
    return (
        <ul>
            {renderedComments}
        </ul>
    );
    
};

// Exports
export default CommentListComponent;