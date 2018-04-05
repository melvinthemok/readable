var express = require('express')
var router = express.Router()
var authController = require('../controllers/authController')

router.get('/signup', authController.getSignUp)

router.get('/login', authController.getLogIn)

router.get('/tutor/signup', authController.getTutorSignUp)
router.post('/tutor/signup', authController.postTutorSignUp)

router.get('/catchPlus/signup', authController.getCatchPlusSignUp)
router.post('/catchPlus/signup', authController.postCatchPlusSignUp)

router.get('/tutor/forgot', authController.getTutorForgot)
router.put('/tutor/forgot', authController.putTutorForgot)

router.get('/catchPlus/forgot', authController.getCatchPlusForgot)
router.put('/catchPlus/forgot', authController.putCatchPlusForgot)

router.get('/tutor/reset/:token', authController.getTutorReset)
router.put('/tutor/reset/:token', authController.putTutorReset)

router.get('/catchPlus/reset/:token', authController.getCatchPlusReset)
router.put('/catchPlus/reset/:token', authController.putCatchPlusReset)

router.get('/tutor/login', authController.getTutorLogIn)
router.post('/tutor/login', authController.postTutorLogIn)

router.get('/catchPlus/login', authController.getCatchPlusLogIn)
router.post('/catchPlus/login', authController.postCatchPlusLogIn)

router.get('/logout', authController.getLogOut)

module.exports = router
