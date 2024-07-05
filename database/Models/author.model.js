import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        bio: String,
        birthDate: Date,
        books: [
            {
                type: Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
        verified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: "version_key" }
);

export default mongoose.models.Author || model("Author", authorSchema);
