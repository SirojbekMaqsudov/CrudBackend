const {Schema, model} = require('mongoose')

const Roles = ['USER', 'ADMIN', 'WAITER', 'CASHIER']

const UserSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Roles,
        required: true
    }
})

module.exports = {
    User: model('user', UserSchema),
    Roles
}