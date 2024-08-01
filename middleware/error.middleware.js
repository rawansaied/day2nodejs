// middlewares/error.middleware.js
export const error = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  };
  