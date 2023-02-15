import express from 'express';
import {createDatabase} from './database';
import buyerRoutes from './routes/buyer';
import sellerRoutes from './routes/supplier';
import loginRoute from './routes/login';
import productRoutes from './routes/product';
import ordersRoutes from './routes/order';
import * as dotenv from 'dotenv';

dotenv.config();

//TODO: remove this
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function main() {

    await createDatabase();

    const app = express();

    const PORT = 8006;

    process.on('uncaughtException', function (err) {
        console.log(err);
    });

    app.use('/v1/buyers', buyerRoutes);

    app.use('/v1/suppliers', sellerRoutes);

    app.use('/v1/login', loginRoute);

    app.use('/v1/products', productRoutes);

    app.use('/v1/orders', ordersRoutes);

    app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
}

main();
