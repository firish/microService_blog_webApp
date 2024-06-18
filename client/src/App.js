// Import Modules
import React from 'react';
import PostCreateComponent from './postCreate';
import PostListComponent from './postList';

// React Component
const App = () => {
    // The entire Landing Page Component
    return (
    
    // Rendering the component to create posts
    <div className='container'>
        <h1>Create A Post</h1>
        <PostCreateComponent />
        <hr />
        <h1>Posts</h1>
        <PostListComponent />
    </div>
    
    );
    
};

// Export Modules
export default App;