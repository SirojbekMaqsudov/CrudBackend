class ApiError extends Error {
    constructor(status, message) {
        super()
        this.status = status
        this.message = message
    }

    static badRequest(message) {
        return new ApiError(400, message || 'Bad Request')
    }

    static NotFound(message) {
        return new ApiError(404, message)
    }

    static Exist(message) {
        return new ApiError(400, message)
    }

    static Validation(message) {
        return new ApiError(400, message)
    }

    static InitialServerError() {
        return new ApiError(500, 'Initial Server Error!')
    }
}

module.exports = { ApiError }