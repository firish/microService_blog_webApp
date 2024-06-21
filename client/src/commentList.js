// Imports
import React from 'react';

// React Component
const CommentListComponent = ({comments}) => {

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