import express from 'express';
import {getUserContainer} from '../database.js';
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json());

const container = await getUserContainer();

router.get('/', (req, res) => {

});

router.post('/',  async (req, res) => {
    await container.items.create(req.body);
    res.sendStatus(200);
});

export default router;