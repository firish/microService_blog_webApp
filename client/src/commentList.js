// Imports
import React from 'react';

// React Component
const CommentListComponent = ({comments}) => {
    
    let content;
    // Display cards for each retrieved post
    const renderedComments = comments.map(comment => {
        if (comment.status === "accepted"){
            content = comment.content;
        }
        else if (comment.status === "pending"){
            content = "This comment is awaiting moderation";
        }
        else if (comment.status === "rejected"){
            content = "This comment was hidden by the moderators";
        }
        return (
            <li key={comment.id}>{content}</li>
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