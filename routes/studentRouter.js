var express = require('express')
var router = express.Router()
var studentController = require('../controllers/studentController')

router.get('/new', studentController.getStudentSignUp)

router.post('/new', studentController.postStudentSignUp)

module.exports = router
