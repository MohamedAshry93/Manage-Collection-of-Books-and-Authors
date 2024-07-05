import ErrorHandlerClass from "../Utils/error-class.utils.js";

const errorHandling = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
            console.log({ message: "Error in error handling middleware", err });
            const insights = {
                error: "unhandled API error",
            };
            next(
                new ErrorHandlerClass(
                    err.message,
                    500,
                    err.stack,
                    err.name,
                    insights
                )
            );
        });
    };
};

const globalResponse = (err, req, res, next) => {
    if (err) {
        res.status(err.statusCode || 500).json({
            message: "Internal server error",
            error: err.message,
            stack: err.stack,
            errPosition: err.name,
            data: err.data,
        });
    }
};

export { errorHandling, globalResponse };
