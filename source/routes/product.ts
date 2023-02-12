import express from 'express';
import { getUserContainer } from '../database';
import bodyParser from "body-parser";

const router = express.Router();

router.use(bodyParser.json());

// GET PRODUCT DETAILS
router.get('/:id', async (req, res) => {
    try {
        
        res.sendStatus(200);

    } catch (e) {
        res.sendStatus(500);
    }
});




export default router;