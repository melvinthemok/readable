var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.get('/signup', authController.getSignUp)

router.get('/login', authController.getLogIn)

router.get('/tutor/signup', authController.getTutorSignUp)
router.post('/tutor/signup', authController.postTutorSignUp)

router.get('/catchPlus/signup', authController.getCatchPlusSignUp)
router.post('/catchPlus/signup', authController.postCatchPlusSignUp)

router.get('/tutor/login', authController.getTutorLogIn)
router.post('/tutor/login', authController.postTutorLogIn)

router.get('/catchPlus/login', authController.getCatchPlusLogIn)
router.post('/catchPlus/login', authController.postCatchPlusLogIn)

router.get('/logout', authController.getLogOut)

module.exports = router
