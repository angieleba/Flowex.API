import express from 'express';
import {createDatabase} from './database';
import buyerRoutes from './routes/buyer';
import sellerRoutes from './routes/seller';
import login from './routes/login';
import * as dotenv from 'dotenv';

dotenv.config();

//TODO: remove this
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function main() {

    await createDatabase();

    const app = express();

    const PORT = 9005;

    process.on('uncaughtException', function (err) {
        console.log(err);
    });

    app.use('/v1/buyers', buyerRoutes);

    app.use('/v1/sellers', sellerRoutes);

    app.use('/v1/login', login);

    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
}

main();
