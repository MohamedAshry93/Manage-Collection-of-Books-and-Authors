import jwt from "jsonwebtoken";
import Author from "../../database/Models/author.model.js";
import ErrorHandlerClass from "./../Utils/error-class.utils.js";

const auth = () => {
    return async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            next(
                new ErrorHandlerClass(
                    "Please signIn again,there is no token generated",
                    401,
                    "at auth middleware",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        if (!token.startsWith("authorBook")) {
            next(
                new ErrorHandlerClass(
                    "Invalid token",
                    401,
                    "at auth middleware",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        const originalToken = token.split(" ")[1];
        const decodedData = jwt.verify(originalToken, "accessTokenSignature");
        if (!decodedData?.authorId) {
            next(
                new ErrorHandlerClass(
                    "Invalid token payload",
                    401,
                    "at verify decodedData",
                    "Error in auth middleware",
                    { token }
                )
            );
        }
        const author = await Author.findById(decodedData.authorId).select(
            "-password"
        );
        if (!author) {
            next(
                new ErrorHandlerClass(
                    "Please signUp and try to logIn again",
                    401,
                    "at findAuthorById",
                    "Error in auth middleware",
                    { authorId: decodedData.authorId }
                )
            );
        }
        req.authAuthor = author;
        next();
    };
};

export { auth };
