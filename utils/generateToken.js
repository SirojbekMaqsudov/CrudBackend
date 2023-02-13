const jwt = require('jsonwebtoken')

module.exports = {
    generateToken: (id, email, role, password, name) => {
        return jwt.sign({id, email, role, password, name }, process.env.JWT_SECRET, {expiresIn: '10d'})
    }
}