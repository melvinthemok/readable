const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/signup', authController.getSignUp)

router.post('/signup', authController.postSignUp)

router.get('/login', authController.getLogIn)

router.post('/login', authController.postLogIn)

router.get('/logout', authController.getLogOut)

module.exports = router
