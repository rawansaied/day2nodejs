import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { validationResult } from 'express-validator';

const POSTS_FILE = 'posts.json';

// Load posts from file
function loadPosts() {
    if (fs.existsSync(POSTS_FILE)) {
        try {
            const jsonData = fs.readFileSync(POSTS_FILE, 'utf-8');
            return JSON.parse(jsonData);
        } catch (err) {
            console.error('Error parsing JSON from file:', err);
            return {};
        }
    }
    return {};
}

function savePosts(data) {
    try {
        fs.writeFileSync(POSTS_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing JSON to file:', err);
    }
}

let posts = loadPosts();

// Get all posts
export const getAllPosts = (req, res) => {
    let result = Object.values(posts);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (req.query.title) {
        result = result.filter(post => post.title.toLowerCase().includes(req.query.title.toLowerCase()));
    }

    if (req.query.sortBy === 'date') {
        result = result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.json(result);
};

// Create a new post
export const createPost = (req, res) => {

    const newPost = req.body;
    const id = uuidv4();
    posts[id] = { ...newPost, id };
    savePosts(posts);
    res.status(201).json({ message: 'Post created.', id, ...newPost });
};

// Update an existing post
export const updatePost = (req, res) => {
    const updatedData = req.body;
    const id = updatedData.id;
    if (!id || !posts[id]) {
        return res.status(404).json({ error: 'Post not found or ID is missing' });
    }

    posts[id] = { ...posts[id], ...updatedData };
    savePosts(posts);
    res.json({ message: 'Post updated successfully', post: posts[id] });
};

// Delete a post
export const deletePost = (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID field is required for delete' });
    }

    if (posts[id]) {
        delete posts[id];
        savePosts(posts);
        res.json({ message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
};
