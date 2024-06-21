// Imports
import React, {useState, useEffect} from 'react';
import axios from 'axios';

// custom Imports
import CommentCreateComponent from './commentCreate';
import CommentListComponent from './commentList';

// React Component
const PostListComponent = () => {
    // Setting up the react hooks for this component
    const [posts, setPosts] = useState({});

    // Component API requests
    const fetchPosts = async () => {
        try {
            // Make the GET API request
            // TODO: Create a constant file for API endpoints?
            const res = await axios.get('http://localhost:4002/posts'); // making the request to the query service instead of the post service
            // console.log('Posts fetched:', res.data);
            setPosts(res.data);
        } catch (exception) {
            // TODO: Create a constants file with error codes?
            alert(`Service Error: ${exception.message}`);
        }
    };

    // Set up useEffect, to only run fetchPosts one time (onLoad)
    useEffect(()=>{
        fetchPosts();
    }, []); 

    // Display cards for each retrieved post
    const renderedPosts = Object.values(posts).map(post => {
        // console.log(`Rendering post with ID: ${post.id}`);
        return (
            <div 
                className='card' 
                style={{width: '30%', marginBottom: '20px'}}
                key={post.id}
            >
                <div className='card-body'>
                    <h3>{post.title}</h3>
                    <CommentListComponent comments={post.comments} />
                    <CommentCreateComponent postId={post.id} />
                </div>
            </div>
        );
    });

    // The PostList component
    return (
        <div className='d-flex flex-row flex-wrap justify-content-between'>
            {renderedPosts}
        </div>
    );
    
};

// Exports
export default PostListComponent;