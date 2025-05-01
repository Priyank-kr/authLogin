import mongoose from "mongoose";

const connectDB = async () =>{    

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
        console.log('DB Connected');

    }catch(error){
        console.log(error)
    }
};

export default connectDB;