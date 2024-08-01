import bodyParser from 'body-parser';
import { userRoute } from "./routes/uses.js";

// server.js
import express from 'express';
import { error } from './middleware/error.middleware.js';
import cors from 'cors';
import router from "./routes/post.route.js";

const app = express();
app.use(bodyParser.json());
app.use("/", userRoute);
app.use('/posts', router);

// Middleware
app.use(cors());
app.use(express.json());

// Error Handling Middleware
app.use(error);

// Start Server
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
