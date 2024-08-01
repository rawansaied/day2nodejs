
import { Router } from "express";
import express from 'express';
import { body } from 'express-validator';


export const userRoute = Router();
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
  } from "../controllers/uses.js";



userRoute.get('/data',getAllUsers)
userRoute.post('/create', [
    body('name').isString().notEmpty(),
    body('age').isInt({ gt: 0 }),
    body('country').isString().notEmpty()
], createUser);

userRoute.delete('/delete',deleteUser)
userRoute.put('/update', updateUser);
