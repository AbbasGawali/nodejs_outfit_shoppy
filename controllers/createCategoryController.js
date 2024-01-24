import CategoryModel from "../models/CategoryModel.js";
import slugify from "slugify";
export const createCategoryController = async (req, res) => {

    try {
        const { name } = req.body;
        if (!name) {
            res.status(401).send({
                success: false,
                message: "Name is Required"
            })
        }
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            return res.status(401).send({
                success: false,
                message: "Category is already present"
            })
        }

        const category = await CategoryModel.create({ name, slug: slugify(name) });
        res.status(201).send({
            success: true,
            message: "Category created successfully",
            category: category
        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "error in Category"
        })
    }
}


export const updateCategoryController = async (req, res) => {
    try {
        const { name } = req.body;
        const { id } = req.params;

        const category = await CategoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            message: "Category Update Successfull",
            category
        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "error in Category"
        })
    }


}

export const getAllCategoryController = async (req, res) => {

    try {

        const category = await CategoryModel.find({});
        res.status(200).send({
            success: true,
            message: "All Categories List",
            category
        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "error Fetching Category"
        })
    }
}



export const getSingleCategoryController = async (req, res) => {
    try {

        const { slug } = req.params;

        const result = await CategoryModel.findOne({ slug });
        if (!result) {
            return res.status(404).send({
                success: false,
                message: "Category Not Found",
                result
            })
        }
        res.status(200).send({
            success: true,
            message: "Single Category Fetch Success",
            result
        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "error Fetching Single Category"
        })
    }
}


export const deleteCategoryController = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await CategoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Category Deleted Successfully"
        })



    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "error Deleting Category"
        })
    }
}