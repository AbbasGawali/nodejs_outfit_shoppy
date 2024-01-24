import express from "express"
import { requiredSignIn, isAdmin } from "../middlewares/authMiddleware.js"
import { createCategoryController, deleteCategoryController, getAllCategoryController, getSingleCategoryController, updateCategoryController } from "../controllers/createCategoryController.js";
const router = express.Router();

// routes 

// create category
router.post("/create-category", requiredSignIn, isAdmin, createCategoryController);

// update category
router.put("/update-category/:id", requiredSignIn, isAdmin, updateCategoryController);

// get all category
router.get("/get-category", getAllCategoryController);

// get single category
router.get("/get-single-category/:slug", getSingleCategoryController);


// delete category
router.delete("/delete-category/:id", requiredSignIn, isAdmin, deleteCategoryController);





export default router;