import express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRoute from "./routes/authRoute.js"
import productRoute from "./routes/productRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import connectDB from "./config/db.js";
import cors from "cors";
// middlewares
const app = express();
const port = process.env.PORT ||8000;
app.use(express.json());
app.use(cors());

// app.use(cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", 'PUT', 'DELETE'],
//     credentials: true,
//     sameSite: "none", 
// }));

// db connection 
connectDB(process.env.DB_URI);


// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

// rest api
app.get("/", (req, res) => {
    res.json({
        message: "hello to ecommerce"
    })
})


// we are following mvc pattern here
app.listen(port, () => {
    console.log(`listening at port ${port}`);
})
