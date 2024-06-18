// Imports
import React, {useState} from 'react';
import axios from 'axios';

// React Components
const CommentCreateComponent = ({postId}) => {
    // Setting up the react hooks for this component
    const [content, setContent] = useState('');

    // Component API requests
    const onSubmit = async (event) => {
        event.preventDefault(); // Disable the default onSubmit action
        // console.log(`POSTId : ${postId}`);

        try {
            // Make the Post API request
            // TODO: Create a constant file for API endpoints?
            await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
                content,
            });

            setContent(''); // Clear the comment content after a successful request
        } catch (exception) {
            // TODO: Create a constants file with error codes?
            alert(`Service Error: ${exception.message}`);
        }
    };

    // Create comment component
    return (<div>

        {/* Setting up the create comment form */}
        <form onSubmit={onSubmit}>

            {/* Taking the post input from the user */}
            <div className='form-group'>
                <label>New Comment</label>
                <input 
                    value={content}
                    onChange={(e) => setContent(e.target.value)} 
                    className='form-control'>
                </input>
            </div>
            <button className='btn btn-primary'>Submit</button>

        </form>

    </div>);
};

// Export Modules
export default CommentCreateComponent;