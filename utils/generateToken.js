const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: (id, email, role) => {
        return jwt.sign({id, email, role}, process.env.JWT_SECRET, {expiresIn: '10d'})
    }
}