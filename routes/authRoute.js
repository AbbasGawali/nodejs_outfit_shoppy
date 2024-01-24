import express from "express";
import { registerController, loginController, forgotPasswordController, updateProfileController, orderController, allOrderController, orderStatusController } from "../controllers/authController.js";
import { isAdmin, isUser, requiredSignIn } from "../middlewares/authMiddleware.js";


// route object
const router = express.Router();



// routing
// register /post method

router.post("/register", registerController);

// login /post method

router.post("/login", loginController);


// test
router.get("/test", requiredSignIn, isAdmin, (req, res) => {
    // router.get("/test", requiredSignIn, (req, res) => {
    res.status(201).send({
        success: true,
        message: "in test route Successfull",

    })
});

// forgot password 
router.post("/forgot-password", forgotPasswordController);


// protected route auth
router.get("/user-auth", requiredSignIn, isUser, (req, res) => {
    res.status(200).send({ ok: true });
})


// protected admn route
router.get("/admin-auth", requiredSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})

// update user profile
router.put("/profile", requiredSignIn, updateProfileController);


// user orders
router.get("/orders", requiredSignIn, orderController);



// admin get all orders
router.get("/all-orders", requiredSignIn, isAdmin, allOrderController);



// orders status
router.put("/order-status/:orderId", requiredSignIn, isAdmin, orderStatusController);



export default router;