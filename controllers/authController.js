import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import OrderModel from "../models/OrderModel.js";
import JWT from "jsonwebtoken";


const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;

        // validation
        if (!name) {
            return res.json({
                success: false,
                message: "name is required"
            })
        }
        if (!email) {
            return res.json({
                success: false,
                message: "email is required"
            })
        }
        if (!address) {
            return res.json({
                success: false,
                message: "address is required"
            })
        }
        if (!password) {
            return res.json({
                success: false,
                message: "password is required"
            })
        }
        if (!phone) {
            return res.json({
                success: false,
                message: "phone no  is required"
            })
        }
        if (!answer) {
            return res.json({
                success: false,
                message: "answer is required"
            })
        }
        // check  user
        const existingUser = await userModel.findOne({ email });

        // existing user

        if (existingUser) {

            return res.status(200).json({
                success: false,
                message: "Already Registered"
            })
        }
        const hashMyPassword = await hashPassword(password);
        // const userCreated = await new userModel({ }).save;
        const user = await userModel.create({ name, email, phone, address, password: hashMyPassword, answer })

        res.status(201).send({
            success: true,
            message: "Registration Successfull",
            user
        })
 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "error while registering user",

        })
    }

}


const loginController = async (req, res) => {
    


    try {
        const { email, password } = req.body;
        if (!email || !password) {


            return res.status(404).json({
                success: false,
                message: "Invalid email or Password"
            })
        }


        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Please register"
            })
        }

        const match = await comparePassword(password, user.password);

        if (!match) {

            return res.status(404).json({
                success: false,
                message: "Invalid email or Password"
            })
        }

 
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET,
            { expiresIn: "7d" });


        res.status(200).send({
            success: true,
            message: "login successfull",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "error while user login",

        })
    }
}

// forgot password 

const forgotPasswordController = async (req, res) => {
    try {


        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ success: false, message: "Email is Required" })
        }
        if (!answer) {
            res.status(400).send({ success: false, message: "answer is Required" })
        }
        if (!newPassword) {
            res.status(400).send({ success: false, message: "New Password is Required" })
        }


        // check 
        const user = await userModel.findOne({ email, answer });
        // validation
        if (!user) {
            return res.status(404).json({
                success: false,
                error: "Wrong Email or Answer",

            })
        }

        const hashed = await hashPassword(newPassword);

        await userModel.findByIdAndUpdate(user._id, { password: hashed });

        res.status(200).json({
            success: true,
            message: "Password Reset Success"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Something Went Wrong",

        })
    }
}

// update profile

export const updateProfileController = async (req, res) => {
    try {

        const { name, password, address, phone } = req.body;


        const user = await userModel.findById(req.user._id);

        if (password && password.length < 6) {
            return res.json({
                error: "Password is Required, 6 Character Long"
            })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;




        // const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
        //     name: name || user.name,
        //     password: hashedPassword || user.password,
        //     phone: phone || user.phone,
        //     address: address || user.address,
        // })

        const updatedUser = await userModel.findByIdAndUpdate(
            { _id: req.user._id },
            {
                $set: {
                    name: name || req.user.name,
                    password: hashedPassword || req.user.password,
                    phone: phone || req.user.phone,
                    address: address || req.user.address,
                },
            },
            { new: true } // This option returns the updated document
        )






        res.status(200).json({
            success: true,
            message: "User Updated successfully",
            updatedUser

        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,

        })
    }
}





export const orderController = async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.user._id }).populate("products", "-photo").populate("buyer", "name");

     
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Error getting Orders"

        })
    }
}

export const allOrderController = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate("products", "-photo").populate("buyer", "name")
            .sort({ createdAt: -1 });

       
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Error getting Orders"

        })
    }
}

export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const orders = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: "Error Updating Order Status"

        })
    }
}
export { registerController, loginController, forgotPasswordController };