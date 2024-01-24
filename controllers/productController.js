import slugify from "slugify";
import ProductModel from "../models/ProductModel.js"
import fs from "fs";
import CategoryModel from "../models/CategoryModel.js";
import braintree from "braintree";
import OrderModel from "../models/OrderModel.js";
import dotenv from "dotenv";

dotenv.config();

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});


export const createProductController = async (req, res) => {
    try {

        const { name, description, slug, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;


        switch (true) {
            case !name:
                res.status(500).send({ success: false, message: "Name is required" });
                break;
            case !description:
                res.status(500).send({ success: false, message: "Description is required" });
                break;
            case !price:
                res.status(500).send({ success: false, message: "Price is required" });
                break;
            case !category:
                res.status(500).send({ success: false, message: "Category is required" });
                break;
            case !quantity:
                res.status(500).send({ success: false, message: "Quantity is required" });
                break;
            case !photo && photo.size > 1000000:
                res.status(500).send({ success: false, message: "Photo is required & should be less than 1 MB" });
                break;
            default:
                break;

        }




        const result = new ProductModel({
            ...req.fields, slug: slugify(name)
        })

        if (photo) {
            result.photo.data = fs.readFileSync(photo.path);
            result.photo.contentType = photo.type;
        }

        await result.save();
        res.status(201).send({
            success: true,
            message: "Product created successfully",
            result
        })


    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error creating Product",
            error
        })
    }
}


export const getProductController = async (req, res) => {
    try {

        const productResult = await ProductModel
            .find({})
            .select("-photo")
            .limit(12)
            .populate("category")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All Products",
            productResult,
            total: productResult.length
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to fetch Products"
        })
    }
}


export const getLimitedProductController = async (req, res) => {
    try {

        const noOfProducts = req.params.number;
        const categoryId = req.params.category;

        const productResult = await ProductModel
            .find({ category: categoryId })
            .select("-photo")
            .limit(noOfProducts)
            .populate("category")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All Products",
            productResult,
            total: productResult.length
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to fetch Products"
        })
        console.log(error)
    }
}


export const getAllProductController = async (req, res) => {
    try {

        const productResult = await ProductModel
            .find({})
            .select("-photo")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            message: "All Products",
            productResult,
            total: productResult.length
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to fetch Products"
        })
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const { slug } = req.params;
        const productResult = await ProductModel.findOne({ slug: slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Product",
            productResult,
            total: productResult.length
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to fetch Product"
        })
    }
}

export const getSingleProductPhotoController = async (req, res) => {
    try {
        const { id } = req.params;
        const productPhotoResult = await ProductModel.findById(id)
            .select("photo");

        if (productPhotoResult.photo.data) {
            res.set("Content-type", productPhotoResult.photo.contentType)
            return res.status(200).send(productPhotoResult.photo.data

            )
        }



    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Failed to fetch Product img"
        })
    }
}

export const updateProductController = async (req, res) => {
    try {



        const { name, description, slug, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        if (!name) {
            return res.status(500).send({ success: false, message: "Name is required" });
        } else if (!description) {
            return res.status(500).send({ success: false, message: "Description is required" });
        } else if (!price) {
            return res.status(500).send({ success: false, message: "Price is required" });
        } else if (!category) {
            return res.status(500).send({ success: false, message: "Category is required" });
        } else if (!quantity) {
            return res.status(500).send({ success: false, message: "Quantity is required" });
        }


        // else if (!photo || (photo && photo.size > 1000000)) {
        //     return res.status(500).send({ success: false, message: "Photo is required & should be less than 1 MB" });
        // }



        else {



            const result = await ProductModel.findByIdAndUpdate(req.params.id, {
                ...req.fields, slug: slugify(name)
            }, { new: true })

            if (photo) {
                result.photo.data = fs.readFileSync(photo.path);
                result.photo.contentType = photo.type;
            }

            await result.save();
            res.status(201).send({
                success: true,
                message: "Product Updated successfully",
                result
            })


        }


    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to Update Product"
        })
        console.log(error);
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductModel.findByIdAndDelete(id).select("-photo");

        res.status(200).send({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Failed to delete Product"
        })
    }
}


// productFilterController

export const productFilterController = async (req, res) => {
    try {

        const { checked, radio } = req.body;
        let args = {};

        if (checked.length > 0) {
            args.category = checked;
        }
        if (radio.length) {
            args.price = { $gte: radio[0], $lte: radio[1] }
        }
        const products = await ProductModel.find(args);
        res.status(200).send({
            success: true,
            products
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error Fetching Products"
        })
    }
}

export const productCountController = async (req, res) => {
    try {
        const total = await ProductModel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            total
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in Product Counts",
            error
        })
    }
}

export const productListController = async (req, res) => {

    try {

        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;
        const products = await ProductModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            products,
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in Product Counts",
            error
        })
    }
}


export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const result = await ProductModel.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        }).select("-photo");

        res.json(result);

    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error in Search",
            error
        })
    }
}

export const relatedProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;

        const products = await ProductModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category");

        res.status(200).send({
            success: true,
            message: "Similar Product Fetched Successfully",
            products
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error Fetching Similar Products",
            error
        })
    }
}

export const categoryProductController = async (req, res) => {
    try {

        const category = await CategoryModel.findOne({ slug: req.params.slug });
        const products = await ProductModel.find({ category }).populate('category');


        res.status(200).send({
            success: true,
            message: "Product Fetched Successfully",
            category,
            products
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            message: "Error Fetching Products",
            error
        })
    }
}

// payment gateway api function 
export const braintreeTokenController = async (req, res) => {
    try {

        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.send(500).send(err);
            } else {
                res.send(response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}






// payment controller braintree

export const braintreePaymentController = async (req, res) => {
    try {

        const { cart, nonce } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price
        })


        let newTransaction = gateway.transaction.sale({
            amount: total,
            paymentMethodNonce: nonce,
            options: {
                submitForSettlement: true,
            }
        },


            function (error, result) {


                if (result) {
                    const order = new OrderModel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();

                    res.json({ ok: true });


                } else {
                    res.status(500).send(error);
                }
            }


        );


    } catch (error) {
        console.log(error);
    }

}