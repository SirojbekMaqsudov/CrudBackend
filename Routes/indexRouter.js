const Router = require('express')
const router = new Router()

const UserRouter = require('./UserRouter')
router.use('/users', UserRouter)

module.exports = router