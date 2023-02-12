import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";
import { Company } from '../models/company';
import { Supplier } from '../models/supplier';
const router = express.Router();

router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const container = await getUserContainer();
    const querySpec = {
        query: "select * from u where u.partitionKey=@partitionKey",
        parameters: [
            {
                name: "@partitionKey",
                value: new Supplier().partitionKey
            }
        ]
    };

    // // Get items 
    const { resources } = await container.items.query(querySpec).fetchAll();
    console.log(resources.length);
    res.send(resources);
});

router.post('/', async (req, res) => {

    try {
        const container = await getUserContainer();

        let company = new Company(
            req.body.company.name,
            req.body.company.registrationNumber
        );

        let seller = new Supplier(
            req.body.firstName,
            req.body.lastName,
            req.body.birthday,
            req.body.phoneNumber,
            req.body.email,
            req.body.vat,
            req.body.password,
            req.body.photo,
            "address", //TODO: Get hedera address
            company);

        if (seller.isValid()) {
            const querySpec = {
                query: "select * from u where u.email=@email",
                parameters: [
                    {
                        name: "@email",
                        value: req.body.email
                    }
                ]
            };
            const { resources } = await container.items.query(querySpec).fetchAll();
            if (resources.length > 0) {
                res.send(422);
            } else {
                await container.items.create(seller);
                res.sendStatus(200);
            }
        } else {
            res.sendStatus(403);
        }

    } catch (e) {
        res.send(500);
    }
});

//GET SELLER BY ID
router.get('/:id', async (req, res) => {
    try {

        let resources = await getById(req.params.id);

        if (resources.length == 1) {
            res.send(resources[0]);
        }

        if (resources.length == 0) {
            res.sendStatus(404);
        }

        if (resources.length > 1) {
            res.sendStatus(500);
        }

    } catch (e) {
        res.sendStatus(500);
    }
});


router.get('/:id/products', async (req, res) => {
    try {

        let supplier: Supplier | undefined = undefined;
        let resources = await getById(req.params.id);

        if (resources.length == 1) {
            supplier = resources[0];
            const anonymousAddress = supplier?.anonymousAddress;

            //TODO: Use hedera address to take products from smart contract
            res.send("LIST OF PRODUCTS OF SUPPLIER");
        }

        if (resources.length == 0) {
            res.sendStatus(404);
        }

        if (resources.length > 1) {
            res.sendStatus(500);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

async function getById(id: string) {
    const container = await getUserContainer();

    const querySpec = {
        query: "select * from u where u.id=@id",
        parameters: [
            {
                name: "@id",
                value: id
            }
        ]
    };

    const { resources } = await container.items.query(querySpec).fetchAll();

    return resources;
}

export default router;