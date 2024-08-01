import { v4 as uuid } from "uuid";

let users = {};

export const createUser = (username, password) => {
  const id = uuid();
  users[id] = { id, username, password };
  return users[id];
};

export const getUserByUsername = (username) => {
  return Object.values(users).find(user => user.username === username);
};

export const getUserById = (id) => {
  return users[id];
};
