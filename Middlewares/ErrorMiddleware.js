const {ApiError} = require("../utils/Error");

module.exports = {
    ErrorMiddleware: (error, req, res, next) => {
        if (error instanceof ApiError) {
            return res.json({error: error.message, status: error.status}).status(error.status)
        }
        return res.json({status: 500, message: ApiError.InitialServerError().message})
    }
}