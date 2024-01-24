import Jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


// protected routes token based 
export const requiredSignIn = (req, res, next) => {
 
    try { 
        if (!req.headers.authorization) {
            return res.status(401).send({
                success: false,
                message: "Please Login"
            })
        }
 
        const decode = Jwt.verify(req.headers.authorization, process.env.JWT_SECRET);

    
        req.user = decode;

 
        next();
    } catch (error) { 
       
        res.status(401).send({
            success: false,
            message: "Invalid Token or Invalid Credentials",
            error
        })
    }

}



// is user  middleware, admin cannot go to user dashboard
export const isUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);


        if (!user) {
            return res.status(401).send({
                success: false,
                message: "unauthorised access"
            })
        }

        if (user.role !== 0) {
            return res.status(401).send({
                success: false,
                message: "unauthorised access"
            })
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error: error,
            message: "Error in Admin middleware"
        })
    }


}









// is admin middleware
export const isAdmin = async (req, res, next) => { 
    try {
        const user = await userModel.findById(req.user._id);



        if (!user) {
            return res.status(401).send({
                success: false,
                message: "unauthorised access"
            })
        }

        if (user.role !== 1) {
            return res.status(401).send({
                success: false,
                message: "unauthorised access"
            })
        } else {
            next();
        }

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error: error,
            message: "Error in Admin middleware"
        })
    }


}