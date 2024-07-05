import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Author from "../../../database/Models/author.model.js";
import { sendEmailService } from "../../Services/send-email.service.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Registration ========================================== //
const signUp = async (req, res, next) => {
    const { name, email, password, bio, birthDate, books } = req.body;
    const authorInstance = new Author({
        name,
        email,
        password,
        bio,
        birthDate,
        books,
    });
    const token = jwt.sign(
        { authorId: authorInstance._id },
        "confirmationLinkToken",
        { expiresIn: "1h" }
    );
    const confirmationLink = `${req.protocol}://${req.headers.host}/authors/verify-email/${token}`;
    const isEmailSent = await sendEmailService(
        email,
        "Welcome to Our App - Verify your email address",
        "Please verify your email address",
        `<a href=${confirmationLink}>Please verify your email address</a>`
    );
    if (!isEmailSent.accepted.length) {
        next(
            new ErrorHandlerClass(
                "Verification sending email is failed, please try again",
                400,
                "at checking isEmailSent",
                "Error in signUp controller",
                { email }
            )
        );
    }
    const author = await authorInstance.save();
    res.status(201).json({
        message: "Author created successfully",
        authorData: {
            id: author._id,
            name: author.name,
            verified: author.verified,
        },
    });
};

//! ============================================= Verify email ============================================= //
const verifyEmail = async (req, res, next) => {
    const { token } = req.params;
    const decoded = jwt.verify(token, "confirmationLinkToken");
    const confirmedAuthor = await Author.findOneAndUpdate(
        { _id: decoded?.authorId, verified: false },
        { verified: true },
        { new: true }
    );
    if (!confirmedAuthor) {
        next(
            new ErrorHandlerClass(
                "Invalid verification link",
                404,
                "at checking confirmedAuthor",
                "Error in verifyEmail controller",
                { token }
            )
        );
    }
    res
        .status(200)
        .json({ message: "Email verified successfully", confirmedAuthor });
};

//! ============================================= Login ============================================= //
const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
        next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                404,
                "at checking author",
                "Error in signIn controller"
            )
        );
    }
    if (!bcrypt.compareSync(password, author.password)) {
        next(
            new ErrorHandlerClass(
                "Invalid Login credentials",
                401,
                "at comparing password",
                "Error in signIn controller"
            )
        );
    }
    const token = jwt.sign(
        { authorId: author._id, name: author.name, email: author.email },
        "accessTokenSignature",
        { expiresIn: "1h" }
    );
    res.status(200).json({ Message: "User logged in successfully", token });
};

//! ====================================== Retrieve all authors ====================================== //
const retrieveAllAuthors = async (req, res) => {
    const authors = await Author.find({}, { password: 0 });
    res.status(200).json({ message: "Authors retrieved successfully", authors });
};

//! ======================== Retrieve a specific author by id or by token ======================== //
/// >>>>> By ID <<<<<<< ///
const specificAuthorById = async (req, res, next) => {
    const { _id } = req.params;
    const author = await Author.find({ _id });
    if (!author) {
        next(
            new ErrorHandlerClass(
                "Author not found",
                404,
                "at checking author",
                "Error in specificAuthorById controller",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Author retrieved successfully", author });
};
/// >>>>> By Token <<<<<<< ///
const specificAuthorByToken = async (req, res) => {
    const { _id } = req.authAuthor;
    const author = await Author.findById(_id);
    res.status(200).json({ message: "Author retrieved successfully", author });
};

//! ============================ Update a specific author by id or by token ============================ //
/// >>>>> By ID <<<<<<< ///
const updatedAuthorById = async (req, res, next) => {
    const { _id } = req.params;
    const { name } = req.body;
    const author = await Author.findByIdAndUpdate(
        _id,
        { name, $inc: { version_key: 1 } },
        { new: true }
    );
    if (!author) {
        next(
            new ErrorHandlerClass(
                "Author not found",
                404,
                "at checking author",
                "Error in updatedAuthorById controller",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Author updated successfully", author });
};
/// >>>>> By Token <<<<<<< ///
const updatedAuthorByToken = async (req, res) => {
    const { _id } = req.authAuthor;
    const { name } = req.body;
    const author = await Author.findByIdAndUpdate(
        _id,
        { name, $inc: { version_key: 1 } },
        { new: true }
    );
    res.status(200).json({ message: "Author updated successfully", author });
};

//! ========================== Delete a specific author by id or by token ========================== //
/// >>>>> By ID <<<<<<< ///
const deletedAuthorById = async (req, res, next) => {
    const { _id } = req.params;
    const author = await Author.findByIdAndDelete(_id);
    if (!author) {
        next(
            new ErrorHandlerClass(
                "Author not found",
                404,
                "at checking author",
                "Error in deletedAuthorById controller",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Author deleted successfully", author });
};
/// >>>>> By Token <<<<<<< ///
const deletedAuthorByToken = async (req, res) => {
    const { _id } = req.authAuthor;
    const author = await Author.findByIdAndDelete(_id);
    res.status(200).json({ message: "Author deleted successfully", author });
};

//! ================================ Filter authors by name or bio ================================ //
const filterAuthorsByNameOrBio = async (req, res, next) => {
    const { name, bio } = req.query;
    const authors = await Author.find({ $or: [{ name }, { bio }] });
    if (authors.length == 0) {
        next(
            new ErrorHandlerClass(
                "Authors not found",
                404,
                "at checking authors",
                "Error in filterAuthorsByNameOrBio controller",
                { name, bio }
            )
        );
    }
    res.status(200).json({ message: "Authors filtered successfully", authors });
};

//! =========================== Relationship between author and his books =========================== //
const getAuthorBooks = async (req, res, next) => {
    const { _id } = req.params;
    const author = await Author.findById(_id).populate([
        { path: "books", select: "-_id title content author publishedDate" },
    ]);
    if (!author) {
        next(
            new ErrorHandlerClass(
                "Author not found",
                404,
                "at checking author",
                "Error in getAuthorBooks controller",
                { _id }
            )
        );
    }
    res
        .status(200)
        .json({ message: "Author books retrieved successfully", author });
};

//! ================== Add pagination to the GET endpoints for retrieving all authors ================== //
const allAuthorsWithPagination = async (req, res) => {
    const { page, limit } = req.query;
    const authors = await Author.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
    const count = await Author.countDocuments();
    res.status(200).json({
        message: "Authors retrieved successfully",
        authors,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
    });
};

export {
    signUp,
    signIn,
    retrieveAllAuthors,
    specificAuthorById,
    specificAuthorByToken,
    updatedAuthorById,
    updatedAuthorByToken,
    deletedAuthorById,
    deletedAuthorByToken,
    filterAuthorsByNameOrBio,
    getAuthorBooks,
    verifyEmail,
    allAuthorsWithPagination,
};
