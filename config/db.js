import mongoose from "mongoose";
import colors from "colors";
 

const connectDB = async (URI) => {
    try {
        const connection = await mongoose.connect(URI);
        console.log("connection Success".bgGreen.white)
    } catch (err) {
        console.log("Connection Failed ".bgRed.white + err);
    }
}
 
export default connectDB; 