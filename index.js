import express from 'express';
import {createDatabase} from './source/database.js';
import userRoutes from './source/routes/users.js';
import * as dotenv from 'dotenv';

//TODO: remove this
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

dotenv.config();
await createDatabase();

const app = express();
const PORT = 8080;

process.on('uncaughtException', function (err) {
    console.log(err);
});

app.use('/', userRoutes);
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));