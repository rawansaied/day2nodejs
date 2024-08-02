import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { body } from 'express-validator';

const router = express.Router();

const registrationValidation = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

router.post('/register', registrationValidation, registerUser);
router.post('/login', registrationValidation, loginUser);

export default router;
