class errorHandler extends Error {
    constructor(message, status = 400) {
        super(message);
        this.message = message
        this.status = status
        this.name = this.constructor.name;
    }
}

module.exports = errorHandler


// http 400 -> bad request


