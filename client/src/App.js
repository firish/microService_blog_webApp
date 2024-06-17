// Import Modules
import React from 'react';
import PostCreateComponent from './postCreate';

// React Component
const App = () => {
    // The entire Landing Page Component
    return (
    
    // Rendering the component to create posts
    <div className='container'>
        <h1>Create A Post</h1>
        <PostCreateComponent />
    </div>
    
    );
    
};

// Export Modules
export default App;