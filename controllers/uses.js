import { v4 as uuidv4 } from "uuid";
import * as fs from 'fs';
import { validationResult } from 'express-validator';


const DATA_FILE = 'data.json';

// Load data from file
function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            const jsonData = fs.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(jsonData);
        } catch (err) {
            console.error('Error parsing JSON from file:', err);
            return {};
        }
    }
    return {};
}
function saveData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing JSON to file:', err);
    }
}

let users = loadData();

export const getAllUsers = (req, res) => {
    let result = Object.values(users);
    const errors=validationResult(req)

    if (!errors.isEmpty()){
        return next ({ statusCode:400,message:errors.array})
        //const error =new('Invalid request')
        //error.statusCode=400;
        //throw error;
    }

    if (req.query.name) {
        result = result.filter(item => item.name.toLowerCase().includes(req.query.name.toLowerCase()));
    }

    if (req.query.sortBy === 'age') {
        result = result.sort((a, b) => a.age - b.age);
    }

    res.json(result);
}



export const createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newData = req.body;
    const id = uuidv4();
    users[id] = { ...newData, id };
    saveData(users);
    res.status(201).json({ message: 'Record created.', id, ...newData });
};

export const updateUser = (req, res) => {
    const updatedData = req.body;
    const id = updatedData.id;
    if (!id || !users[id]) {
        return res.status(404).json({ error: 'Record not found or ID is missing' });
    }

    users[id] = { ...users[id], ...updatedData };
    saveData(users);
    res.json({ message: 'Record updated successfully', record: users[id] });

};

export const deleteUser =  (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ error: 'ID field is required for delete' });

    }

    if (users[id]) {
        delete users[id];
        saveData(users);
        res.json({ message: 'Record deleted successfully' });
    } else {
        res.status(404).json({ error: 'Record not found' });
    }

};
