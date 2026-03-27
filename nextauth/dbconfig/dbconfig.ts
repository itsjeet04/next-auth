
import mongoose from 'mongoose';

export  async function connect() {

    const isConnected = mongoose.connection.readyState === 1;
    if(isConnected){
        console.log('Already connected to the database!');
        return;
    }


    try{
        console.log('connecting to db'); 
        await mongoose.connect(process.env.MONGO_URI!);
        console.log('Database connection established successfully!');
    }
    catch(error: unknown){
        console.error("Error connecting to the database:", error);
        throw error;
    }
}