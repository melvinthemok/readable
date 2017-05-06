var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.get('/signup', authController.getSignUp)

router.get('/login', authController.getLogIn)

router.get('/signup/tutor', authController.getTutorSignUp)

router.get('/signup/catchPlus', authController.getCatchPlusSignUp)

router.post('/signup/tutor', authController.postTutorSignUp)

router.post('/signup/catchPlus', authController.postCatchPlusSignUp)

router.get('/login/tutor', authController.getTutorLogIn)

router.get('/login/catchPlus', authController.getCatchPlusLogIn)

router.post('/login/tutor', authController.postTutorLogIn)

router.post('/login/catchPlus', authController.postCatchPlusLogIn)

router.get('/logout', authController.getLogOut)

module.exports = router
