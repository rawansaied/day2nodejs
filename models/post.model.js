import { v4 as uuid } from "uuid";

let posts = {};

export const createPost = (userId, title, content) => {
  const id = uuid();
  posts[id] = { id, userId, title, content };
  return posts[id];
};

export const getPostsByUser = (userId) => {
  return Object.values(posts).filter(post => post.userId === userId);
};

export const getPostById = (id) => {
  return posts[id];
};

export const updatePost = (id, title, content) => {
  if (posts[id]) {
    posts[id] = { ...posts[id], title, content };
    return posts[id];
  }
  return null;
};

export const deletePost = (id) => {
  const post = posts[id];
  if (post) {
    delete posts[id];
    return post;
  }
  return null;
};
