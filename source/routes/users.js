import express from 'express';
import {getUserContainer} from '../database.js';
import { CosmosClient } from "@azure/cosmos";
import config from "../../config.js";
import bodyParser from "body-parser";


const router = express.Router();
const container = await getUserContainer();

router.get('/users', (req, res) => {

});

router.use(bodyParser.json());
router.post('/',  async (req, res) => {
    await container.items.create(req.body);
    res.send(200);
});

export default router;