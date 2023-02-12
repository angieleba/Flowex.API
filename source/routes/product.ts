import express from 'express';
import bodyParser from "body-parser";
import { Product } from '../models/product';

const router = express.Router();

router.use(bodyParser.json());

// GET PRODUCT DETAILS
router.get('/:id', async (req, res) => {
    try {
        
        res.send("BY ID");

    } catch (e) {
        res.sendStatus(500);
    }
});

//CREATE PRODUCT
router.post('/', async (req, res) => {
    try {

        let product = new Product();
        product.location = req.body.location;
        product.photo  = req.body.photo;
        product.priceUnit = req.body.priceUnit;
        product.processingType = req.body.processingType;
        product.qualityAttributes = req.body.qualityAttributes;
        product.quantity = req.body.quantity;
        product.shade = req.body.shade;
        product.treeName = req.body.treeName;
        product.woodType = req.body.woodType;

        if(product.isValid()) {
           
                res.sendStatus(200);

        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

//UPDATE PRODUCT
router.put('/:id', async (req, res) => {
    try {

        let product = new Product();
        product.location = req.body.location;
        product.photo  = req.body.photo;
        product.priceUnit = req.body.priceUnit;
        product.processingType = req.body.processingType;
        product.qualityAttributes = req.body.qualityAttributes;
        product.quantity = req.body.quantity;
        product.shade = req.body.shade;
        product.treeName = req.body.treeName;
        product.woodType = req.body.woodType;

        if(product.isValid()) {
           
                res.sendStatus(200);
                     
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        res.sendStatus(500);
    }
});

//DELETE PRODUCT
router.delete('/:id', async (req, res) => {
    try {   
        res.sendStatus(200);

    } catch (e) {
        res.sendStatus(500);
    }
});

//SEARCH PRODUCT
router.get('/', async (req, res) => {
    try {
        
        res.send(req.query.search);

    } catch (e) {
        res.sendStatus(500);
    }
});


export default router;