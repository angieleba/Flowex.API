import express from 'express';
import bodyParser from "body-parser";
import { Product } from '../models/product';
import { createProduct, createProductCompany, getProductById, getProducts, getProductsBySupplier, approveProduct } from '../smart-contracts/products';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.use(bodyParser.json());

// GET PRODUCT DETAILS
router.get('/:supplierId/:id', async (req, res) => {
    try {    
        const products = await getProductById(req.params.id, req.params.supplierId);
        res.json(products).sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/bySupplier', async (req, res) => {
    try {    
        console.log("called");
        
        const products = await getProductsBySupplier(req.query.supplierId as string);
        res.json(products).sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/', async (req, res) => {
    try {    
        const products = await getProducts();
        res.json(products).sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/supplierCompany',async (req, res) => {
    try {
        const result = await createProductCompany(req.body.supplierId);
        if(result) 
                res.sendStatus(200);
            else 
                res.sendStatus(500);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/approveProduct',async (req, res) => {
    try {
        const {productIndex, productId, supplierId, baseURI} = req.body;
        const result = await approveProduct(productIndex, productId, supplierId, baseURI);
        if(result) 
                res.sendStatus(200);
            else 
                res.sendStatus(500);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//CREATE PRODUCT
router.post('/createProduct', async (req, res) => {
    try {
        let product = new Product();
        product.productID = uuidv4();
        product.location = req.body.location;
        product.photo  = req.body.photo;
        product.pricePerUnit = req.body.pricePerUnit;
        product.isRaw = req.body.isRaw;
        // product.qualityAttributes = req.body.qualityAttributes;
        product.amount = req.body.amount;
        product.colour = req.body.colour;
        product.treeType = req.body.treeType;
        product.woodType = req.body.woodType;
        product.unit = req.body.unit;

        if(product.isValid()) { 
            const productCreation = await createProduct(product, req.body.supplierId);
            if(productCreation) 
                res.sendStatus(200);
            else 
                res.sendStatus(500);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

//UPDATE PRODUCT
router.put('/:id', async (req, res) => {
    try {

        let product : Product = req.body.product;

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
