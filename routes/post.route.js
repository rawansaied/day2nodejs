import express from 'express';
import { check, validationResult } from 'express-validator';
import { getAllPosts, createPost, updatePost, deletePost } from '../controllers/post.controller.js';

const router = express.Router();

// Validation rules for creating/updating posts
const postValidation = [
    check('title').isString().notEmpty(),
    check('content').isString().notEmpty(),
    check('author').isString().notEmpty(),
    check('date').isISO8601().toDate() // Ensure date is in ISO format
];

// Routes
router.get('/', getAllPosts);

router.post('/', postValidation, createPost);

router.put('/', postValidation, updatePost);

router.delete('/', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    deletePost(req, res);
});

export default router;
