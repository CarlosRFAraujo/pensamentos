const express = require('express')
const AuthController = require('../controllers/AuthController')
const router = express.Router()

router.get('/login', AuthController.login)

router.post('/login', AuthController.loginPost)

router.get('/registrar', AuthController.register)

router.post('/registrar', AuthController.registerPost)

router.get('/sair', AuthController.logout)


module.exports = router
