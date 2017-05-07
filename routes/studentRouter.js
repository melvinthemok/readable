var express = require('express')
var router = express.Router()
var canCreateStudent = require('../middleware/canCreateStudent')
var studentController = require('../controllers/studentController')

router.get('/new', canCreateStudent, studentController.getStudentSignUp)

router.post('/', canCreateStudent, studentController.postStudentSignUp)

module.exports = router
