import mongoose from "mongoose";

const connectionDB = async () => {
    try {
        await mongoose.connect(
            "mongodb://localhost:27017/manageBookAndAuthorSystem"
        );
        console.log("Connected to the database");
    } catch (error) {
        console.log("Error to connect to the database", error);
    }
};

export {
    connectionDB
}