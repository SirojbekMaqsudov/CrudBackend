const {Router} = require('express')
const {UserController} = require("../Controllers/UserController");
const {checkRole} = require("../Middlewares/CheckRoleMiddleware");
const {AuthMiddleware} = require("../Middlewares/AuthMiddleware");
const router = new Router()

router.get('/', checkRole('ADMIN'), UserController.getAll)
router.get('/getMe', AuthMiddleware, UserController.getMe)
router.get('/:id', UserController.getOne)
router.post('/createUser', checkRole('ADMIN'), UserController.createUser)
router.post('/login', UserController.loginUser)
router.put('/update/:id', checkRole('ADMIN'), UserController.updateUser)
router.delete('/delete/:id', checkRole('ADMIN'), UserController.deleteUser)

module.exports = router