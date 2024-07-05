import mongoose from "mongoose";

const { Schema, model } = mongoose;

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 50,
            lowercase: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
            minLength: 3,
            maxLength: 500,
            lowercase: true,
        },
        author: {
            type: String,
            required: true,
            lowercase: true,
        },
        publishedDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Book || model("Book", bookSchema);
