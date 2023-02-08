const jwt = require('jsonwebtoken')

module.exports = {
    AuthMiddleware: (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.json({status: 401, message: 'Unauthorized'})
            }

            req.user = jwt.verify(token, process.env.JWT_SECRET)

            next()
        }catch (e) {
            return res.json({status: 401, message: 'Unauthorized'})
        }
    }
}