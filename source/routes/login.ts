import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json());


//LOGIN
router.post('/', async (req, res) => {
    try {
        const container = await getUserContainer();

        const querySpec = {
            query: "select * from u where u.email=@email and u.password=@password",
            parameters: [
                {
                    name: "@email",
                    value: req.body.email
                },
                {
                    name: "@password",
                    value: req.body.password
                }
            ]
        };

        const { resources } = await container.items.query(querySpec).fetchAll();

        if (resources.length == 1) {
            res.sendStatus(200);
        }

        if (resources.length == 0) {
            res.sendStatus(404);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

export default router;