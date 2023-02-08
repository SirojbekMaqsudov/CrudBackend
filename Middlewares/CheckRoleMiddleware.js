const jwt = require('jsonwebtoken')

module.exports = {
    checkRole: (role) => {
        return (req, res, next) => {
            try {
                const token = req.headers.authorization.split(' ')[1]
                if (!token) {
                    return res.json({status: 401, message: 'Unauthorized'})
                }

                const user = jwt.verify(token, process.env.JWT_SECRET)
                if (user.role !== role) {
                    return res.json({status: 403, message: 'Forbidden'})
                }

                req.user = user

                next()
            } catch (e) {
                return res.json({status: 403, message: 'Forbidden'})
            }
        }
    }
}