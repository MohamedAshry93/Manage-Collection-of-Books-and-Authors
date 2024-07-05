import { Router } from "express";
import * as bookController from './book.controller.js';
import { errorHandling } from "../../Middlewares/error-handle.middleware.js";

const bookRouter = Router();

bookRouter.post('/addbook', errorHandling(bookController.createBook));
bookRouter.get('/listbooks', errorHandling(bookController.retrieveAllBooks));
bookRouter.get('/search', errorHandling(bookController.filterBooksByTitleOrAuthor));
bookRouter.get('/', errorHandling(bookController.allBooksWithPagination));
bookRouter.get('/:_id', errorHandling(bookController.specificBook));
bookRouter.patch('/:_id', errorHandling(bookController.updatedBook));
bookRouter.delete('/:_id', errorHandling(bookController.deletedBook));


export default bookRouter