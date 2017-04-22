var express = require('express')
var router = express.Router()
var userController = require('../controllers/userController')

router.get('/signup', userController.getSignUp)

router.post('/signup', userController.postSignUp)

router.get('/login', userController.getLogIn)

router.post('/login', userController.postLogIn)

router.get('/logout', userController.getLogOut)

module.exports = router
