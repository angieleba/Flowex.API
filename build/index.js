import express from 'express';
import { createDatabase } from './database.js';
import userRoutes from './routes/users.js';
import * as dotenv from 'dotenv';
//TODO: remove this
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
dotenv.config();
await createDatabase();
const app = express();
const PORT = 9005;
process.on('uncaughtException', function (err) {
    console.log(err);
});
app.use('/users', userRoutes);
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
