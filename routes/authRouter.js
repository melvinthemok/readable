var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.get('/signup', authController.getSignUp)

router.get('/login', authController.getLogIn)

router.get('/signup/teacher', authController.getTeacherSignUp)

router.get('/signup/catchPlus', authController.getCatchPlusSignUp)

router.post('/signup/teacher', authController.postTeacherSignUp)

router.post('/signup/catchPlus', authController.postCatchPlusSignUp)

router.get('/login/teacher', authController.getTeacherLogIn)

router.get('/login/catchPlus', authController.getCatchPlusLogIn)

router.post('/login/teacher', authController.postTeacherLogIn)

router.post('/login/catchPlus', authController.postCatchPlusLogIn)

router.get('/logout', authController.getLogOut)

module.exports = router
