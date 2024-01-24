import express from "express";
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";
import { braintreePaymentController, braintreeTokenController, categoryProductController, createProductController, deleteProductController, getAllProductController, getLimitedProductController, getProductController, getSingleProductController, getSingleProductPhotoController, productCountController, productFilterController, productListController, relatedProductController, searchProductController, updateProductController } from "../controllers/productController.js";
import formidable from "express-formidable";



const router = express.Router();

// create product
router.post("/create-product", requiredSignIn, isAdmin, formidable(), createProductController);

// update product
router.put("/update-product/:id", requiredSignIn, isAdmin, formidable(), updateProductController);

// delete product
router.delete("/delete-product/:id", requiredSignIn, isAdmin, formidable(), deleteProductController);

// get product
router.get("/get-product", getProductController);

// get limited products product
router.get("/get-limited-product/:number/:category", getLimitedProductController);

// get all product without limit for admin
router.get("/get-all-product", getAllProductController);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get single product photo
router.get("/get-product-photo/:id", getSingleProductPhotoController);

// get filter  product 
router.post("/product-filters", productFilterController);

// get count product 
router.get("/product-count", productCountController);

// get per page product 
router.get("/product-list/:page", productListController);

// search product 
router.get("/search/:keyword", searchProductController);

// related  product 
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise product 
router.get("/product-category/:slug", categoryProductController);

// payment routes 
// token
router.get("/braintree/token", requiredSignIn, braintreeTokenController);

// payment  
router.post("/braintree/payment", requiredSignIn, braintreePaymentController);

export default router;