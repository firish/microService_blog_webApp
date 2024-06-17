// Imports
import React, {useState} from 'react';
import axios from 'axios';

// React Components
const PostCreateComponent = () => {
    // Setting up the react hooks for this component
    const [title, setTitle] = useState('');

    // Component API requests
    const onSubmit = async (event) => {
        event.preventDefault(); // Disable the default onSubmit action

        try {
            // Make the Post API request
            // TODO: Create a constant file for API endpoints?
            await axios.post('http://localhost:4000/posts', {
                title
            });

            setTitle(''); // Clear the title after a successful request
        } catch (exception) {
            // TODO: Create a constants file with error codes?
            alert(`Service Error: ${exception.message}`);
        }
    };

    // Create post component
    return (<div>

        {/* Setting up the create post form */}
        <form onSubmit={onSubmit}>

            {/* Taking the post input from the user */}
            <div className='form-group'>
                <label>Title</label>
                <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)} 
                    className='form-control'>
                </input>
            </div>
            <button className='btn btn-primary'>Submit</button>

        </form>

    </div>);
};

// Export Modules
export default PostCreateComponent;