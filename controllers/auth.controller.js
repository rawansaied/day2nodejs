import jwt from "jsonwebtoken";
import { readDataFromFile } from "../utils/helpers.js";
const db = "./controllers/db.json";
import { createUser, getUserByUsername } from "../models/user.model.js";

const SECRET_KEY = "rawan123";

export const auth = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    const err = new Error("unauthorized");
    err.statusCode = 401;
    next(err);
  }

  //   try {
  //     const decode = jwt.verify(token, tokenKey);
  //   } catch (err) {
  //     next(err);
  //   }
  
  const decode = jwt.verify(token, tokenKey, (err, decode) => {
    if (err) {
      next(err);
    }
    return decode;
  });

  const { id } = decode;
  if (!id) {
    const err = new Error("access denied");
    err.statusCode = 403;
    next(err);
  }

  const users = readDataFromFile(db);
  const user = users.find((user) => user.id === id);
  if (!user) {
    const err = new Error("access denied");
    err.statusCode = 403;
    next(err);
  }
  req.user = user;
  next();
};
export const register = (req, res) => {
  const { username, password } = req.body;
  if (getUserByUsername(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const user = createUser(username, password);
  res.status(201).json(user);
};

export const login = (req, res) => {
  const { username, password } = req.body;
  const user = getUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "3d" });
  res.status(200).json({ token });
};

