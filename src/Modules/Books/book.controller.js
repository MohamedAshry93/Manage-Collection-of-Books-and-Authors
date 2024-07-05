import Book from "../../../database/Models/book.model.js";
import ErrorHandlerClass from "../../Utils/error-class.utils.js";

//! ========================================== Create a new book ========================================== //
const createBook = async (req, res) => {
    const { title, content, author, publishedDate } = req.body;
    const bookInstance = new Book({
        title,
        content,
        author,
        publishedDate,
    });
    const book = await bookInstance.save();
    res.status(201).json({ message: "Book created successfully", book });
};

//! ========================================= Retrieve all books ========================================= //
const retrieveAllBooks = async (req, res) => {
    const books = await Book.find();
    res.status(200).json({ message: "Books retrieved successfully", books });
};

//! ====================================== Retrieve a specific book ====================================== //
const specificBook = async (req, res, next) => {
    const { _id } = req.params;
    const book = await Book.findById(_id);
    if (!book) {
        next(
            new ErrorHandlerClass(
                "Book not found",
                404,
                "at specificBook controller",
                "Error in specificBook middleware",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Book retrieved successfully", book });
};

//! ====================================== Update a specific book ====================================== //
const updatedBook = async (req, res, next) => {
    const { _id } = req.params;
    const { content } = req.body;
    const book = await Book.findByIdAndUpdate(
        _id,
        { content, $inc: { version_key: 1 } },
        { new: true }
    );
    if (!book) {
        next(
            new ErrorHandlerClass(
                "Book not found",
                404,
                "at updatedBook controller",
                "Error in updatedBook middleware",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Book updated successfully", book });
};

//! ====================================== Delete a specific book ====================================== //
const deletedBook = async (req, res, next) => {
    const { _id } = req.params;
    const book = await Book.findByIdAndDelete(_id);
    if (!book) {
        next(
            new ErrorHandlerClass(
                "Book not found",
                404,
                "at deletedBook controller",
                "Error in deletedBook middleware",
                { _id }
            )
        );
    }
    res.status(200).json({ message: "Book deleted successfully", book });
};

//! ================== Add pagination to the GET endpoints for retrieving all books ================== //
const allBooksWithPagination = async (req, res) => {
    const { page, limit } = req.query;
    const books = await Book.find()
        .skip((page - 1) * limit)
        .limit(limit * 1)
        .exec();
    const count = await Book.countDocuments();
    res
        .status(200)
        .json({
            message: "All books retrieved successfully",
            books,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
};

//! ================================ Filter books by title or author ================================ //
const filterBooksByTitleOrAuthor = async (req, res, next) => {
    const { title, author } = req.query;
    const books = await Book.find({ $or: [{ title }, { author }] });
    if (books.length == 0) {
        next(
            new ErrorHandlerClass(
                "Books not found",
                404,
                "at filterBooksByTitleOrAuthor controller",
                "Error in filterBooksByTitleOrAuthor middleware",
                { title, author }
            )
        );
    }
    res.status(200).json({ message: "Books filtered successfully", books });
};

export {
    createBook,
    retrieveAllBooks,
    specificBook,
    updatedBook,
    deletedBook,
    filterBooksByTitleOrAuthor,
    allBooksWithPagination
};
