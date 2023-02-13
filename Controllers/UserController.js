const {User} = require("../Models/User");
const {ApiError} = require("../utils/Error");
const {UserValidate} = require("../Validators/UserValidate");
const bcrypt = require('bcrypt')
const {generateToken} = require("../utils/generateToken");
const uuid = require('uuid').v4

class UserController {
    async getAll(req, res) {
        const users = await User.find()
        return res.json(users)
    }

    async getOne(req, res, next) {
        const {id} = req.params

        const {_doc: docs} = await User.findOne({id})

        const {_id, __v, id: ids, ...user} = docs

        if(!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        return res.json(user)
    }

    async getMe(req, res, next) {
        const {id} = req.user

        const user = await User.findOne({id})
        if (!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        const {password, ...doc} = user

        return res.json(doc._doc)
    }

    async createUser(req, res, next) {
        const { name, email, password, phone_number, role } = req.body

        const candidate = await User.findOne({$or: [{email}, {phone_number}]})
        if (candidate) {
            return next(ApiError.Exist('User already exist!'))
        }

        const {error} = UserValidate(req.body)
        if (error) {
            return next(ApiError.Validation(error.details[0].message))
        }

        const hashPassword = await bcrypt.hash(password, 11)

        const user = await User.create({
            id: uuid(),
            name,
            email,
            password: hashPassword,
            phone_number,
            role
        })

        return res.json(user)
    }

    async loginUser(req, res, next) {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return next(ApiError.badRequest('Wrong Password!'))
        }

        const token = generateToken(user.id, user.email, user.role, user.password, user.name)
        // const token = generateToken({user})
        return res.json({token, user})
    }

    async updateUser(req, res, next) {
        const {id} = req.params
        const { name, email, password, phone_number, role } = req.body

        const user = await User.findOne({id})
        if (!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        if (email !== user.email) {
            const candidate = await User.findOne({email})
            if (candidate) {
                return next(ApiError.Exist('User already exist!'))
            }
        }

        if (phone_number !== user.phone_number) {
            const candidate = await User.findOne({phone_number})
            if (candidate) {
                return next(ApiError.Exist('User already exist!'))
            }
        }

        const {error} = UserValidate(req.body, 'update')
        if (error) {
            return next(ApiError.Validation(error.details[0].message))
        }

        const _doc = {
            name: name ? name : user.name,
            email: email ? email : user.email,
            password: password === user.password ? user.password : bcrypt.hashSync(password, 11),
            phone_number: phone_number ? phone_number : user.phone_number,
            role: role ? role : user.role,
        }

        const result = await User.updateOne({id}, {$set: _doc})
        return res.json({ok: result.modifiedCount})
    }

    async deleteUser(req, res, next) {
        const {id} = req.params

        const user = await User.findOne({id})
        if(!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        if (user.id === req.user.id) {
            return next(ApiError.badRequest("Admin o'zini o'zi o'chira olmaydi"))
        }

        const result = await User.deleteOne({id})
        return res.json({deleted: result.deletedCount === true})
    }

    async refreshToken(req, res, next) {
        const {email, password} = req.user

        const user = await User.findOne({email})
        if (!user) {
            return next(ApiError.NotFound('User not found!'))
        }

        if (password !== user.password) {
            return next(ApiError.badRequest('Wrong Password!'))
        }

        const token = generateToken(user.id, email, user.role, password, user.name)

        return res.json({token})
    }
}

module.exports = {
    UserController: new UserController()
}