// Create web server and listen for requests
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Create an object to store the comments in memory
const commentsByPostId = {};

// Create a route to handle the POST request to the comments service
app.post('/posts/:id/comments', async (req, res) => {
    // Get the id from the request parameters
    const { id } = req.params;

    // Get the content from the request body
    const { content } = req.body;

    // Get the comments array for the current post id
    const comments = commentsByPostId[id] || [];

    // Create a new comment object
    const comment = {
        id: generateId(),
        content,
        status: 'pending'
    };

    // Add the new comment to the comments array
    comments.push(comment);

    // Save the comments array in the object
    commentsByPostId[id] = comments;

    // Emit an event for the new comment
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            ...comment,
            postId: id
        }
    });

    // Return the comments array
    res.status(201).send(comments);
});

// Create a route to handle the GET request to the comments service
app.get('/posts/:id/comments', (req, res) => {
    // Get the id from the request parameters
    const { id } = req.params;

    // Get the comments array for the current post id
    const comments = commentsByPostId[id] || [];

    // Return the comments array
    res.send(comments);
});

// Create a route to handle the POST request to the events service
app.post('/events', async (req, res) => {
    // Get the event type from the request body
    const { type, data } = req.body;

    // Check if the event type is CommentModerated
    if (type === 'CommentModerated') {
        // Get the id and status from the event data
        const { id, postId, status, content } = data;

        // Get the comments array for the current post id
        const comments = commentsByPostId[postId];
    
        // Find the comment with the id from the event data