class ErrorHandlerClass {
    constructor(message, statusCode, stack, name, data) {
        this.message = message,
            this.statusCode = statusCode,
            this.stack = stack ? stack : null,
            this.name = name ? name : "Error",
            this.data = data ? data : null
    }
};

export default ErrorHandlerClass