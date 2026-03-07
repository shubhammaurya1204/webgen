import mongoose from "mongoose";
const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB CONNECTED SUCCESSFULLY");
    } catch (error) {
        console.log("DB CONNECTION ERROR");
    }
}
export default connectDB;