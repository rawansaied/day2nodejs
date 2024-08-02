import bodyParser from 'body-parser';
import { userRoute } from "./routes/uses.js";

// server.js
import express from 'express';
import { error } from './middleware/error.middleware.js';
//import cors from 'cors';
import router from "./routes/post.route.js";
import authRouter from './routes/auth.route.js';
import 'dotenv/config';


const app = express();
app.use(express.json());
// Error Handling Middleware
app.use(error);
app.use(bodyParser.json());

// Middleware
//app.use(cors());

app.use("/", userRoute);
app.use('/api', router);
app.use('/auth', authRouter);






// Start Server
const PORT =  5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
