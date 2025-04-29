import mongoose from "mongoose";

const connectDB = async () =>{
    mongoose.connection.on('connected', ()=>console.log('DB Connected'));

    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
    }catch(error){
        console.log(error)
    }
   
};

export default connectDB;