import { Router } from "express";
import * as authorController from "./author.controller.js";
import { checkEmailExist } from "../../Middlewares/checkEmail.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";

const authorRouter = Router();

authorRouter.post(
    "/signup",
    errorHandling(checkEmailExist),
    errorHandling(authorController.signUp)
);

authorRouter.post("/signin", errorHandling(authorController.signIn));

authorRouter.get(
    "/listauthors",
    errorHandling(authorController.retrieveAllAuthors)
);

authorRouter.get(
    "/search",
    errorHandling(authorController.filterAuthorsByNameOrBio)
);

authorRouter.get(
    "/allauthors",
    errorHandling(authorController.allAuthorsWithPagination)
);

authorRouter.get("/:_id", errorHandling(authorController.specificAuthorById));

authorRouter.get(
    "/",
    errorHandling(auth()),
    errorHandling(authorController.specificAuthorByToken)
);

authorRouter.patch("/:_id", errorHandling(authorController.updatedAuthorById));

authorRouter.patch(
    "/",
    errorHandling(auth()),
    errorHandling(authorController.updatedAuthorByToken)
);

authorRouter.delete("/:_id", errorHandling(authorController.deletedAuthorById));

authorRouter.delete(
    "/",
    errorHandling(auth()),
    errorHandling(authorController.deletedAuthorByToken)
);

authorRouter.get(
    "/authorbooks/:_id",
    errorHandling(authorController.getAuthorBooks)
);

authorRouter.get(
    "/verify-email/:token",
    errorHandling(authorController.verifyEmail)
);

export default authorRouter;
