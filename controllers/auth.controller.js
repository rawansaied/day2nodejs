import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


const USERS_FILE = 'users.json';

function loadUsers() {
    if (fs.existsSync(USERS_FILE)) {
        try {
            const jsonData = fs.readFileSync(USERS_FILE, 'utf-8');
            return JSON.parse(jsonData);
        } catch (err) {
            console.error('Error parsing JSON from file:', err);
            return {};
        }
    }
    return {};
}

function saveUsers(data) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error writing JSON to file:', err);
    }
}

export const registerUser = (req, res) => {
   

    const { email, password } = req.body;
    const users = loadUsers();
    

    if (Object.values(users).some(user => user.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }

    const id = uuidv4();
    users[id] = { email, password };
    saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
};

export const loginUser = (req, res) => {
    const { email, password } = req.body;
    const users = loadUsers();

    const user = Object.values(users).find(user => user.email === email);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    res.json({ token });
};
