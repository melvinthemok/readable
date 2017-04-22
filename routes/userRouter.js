const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/signup', userController.getSignUp)

router.post('/signup', userController.postSignUp)

router.get('/login', userController.getLogIn)

router.post('/login', userController.postLogIn)

router.get('/logout', userController.getLogOut)

module.exports = router
