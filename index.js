import express from "express";
import { connectionDB } from "./database/connection.js";
import authorRouter from "./src/Modules/Authors/author.routes.js";
import bookRouter from "./src/Modules/Books/book.routes.js";
import { globalResponse } from "./src/Middlewares/error-handle.middleware.js";
import ErrorHandlerClass from "./src/Utils/error-class.utils.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use("/authors", authorRouter);
app.use("/books", bookRouter);

connectionDB();

app.use("*", (req, res, next) =>
    next(new ErrorHandlerClass(`Invalid url ${req.originalUrl}`, 404))
);
app.use(globalResponse);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
