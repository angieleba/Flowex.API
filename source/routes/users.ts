import express from 'express';
import {getUserContainer} from '../database';
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json());



router.get('/', (req, res) => {

});

router.post('/',  async (req, res) => {
    const container = await getUserContainer();
    await container.items.create(req.body);
    res.sendStatus(200);
});

export default router;