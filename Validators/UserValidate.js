const Joi = require("joi")
const {Roles} = require("../Models/User");

const UserSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(16).required(),
    phone_number: Joi.string().min(9).max(18).required(),
    role: Joi.string().valid(...Roles).required()
})

const UserUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(4).max(100),
    phone_number: Joi.string().min(9).max(18),
    role: Joi.string().valid(...Roles)
})

module.exports = {
    UserValidate: (data, type) => {
        if (type === 'update') {
            return UserUpdateSchema.validate(data)
        }

        return UserSchema.validate(data)
    }
}