import bcrypt from "bcrypt";
import Author from "../../database/Models/author.model.js";
import ErrorHandlerClass from "../Utils/error-class.utils.js";

const checkEmailExist = async (req, res, next) => {
    const { email } = req.body;
    const author = await Author.findOne({ email });
    if (author) {
        // return res.status(400).json({ message: "Email already exist" });
        next(
            new ErrorHandlerClass(
                "Email already exist",
                409,
                "at checkEmailExist API",
                "Error in checkEmail middleware",
                { email }
            )
        );
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    next();
};
export { checkEmailExist };
