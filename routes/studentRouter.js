var express = require('express')
var router = express.Router()
var canCreateStudent = require('../middleware/canCreateStudent')
var studentController = require('../controllers/studentController')

// router.get('/', studentController.getStudentOverview)

// router.get('/fitzroy', studentController.getFitzroyOverview)
// router.get('/pre-school', studentController.getPreSchoolOverview)
// router.get('/post-fitzroy', studentController.getPostFitzroyOverview)



router.get('/new', canCreateStudent, studentController.new)

// router.get('/pre-school/new', canCreateStudent, studentController.getPreSchoolSignUp)
// router.post('/pre-school', canCreateStudent, studentController.postPreSchoolSignUp)

router.get('/fitzroy/new', canCreateStudent, studentController.fitzroy.new)
router.post('/fitzroy', canCreateStudent, studentController.fitzroy.create)

// router.get('/post-fitzroy/new', canCreateStudent, studentController.getPostFitzroySignUp)
// router.post('/post-fitzroy', canCreateStudent, studentController.postPostFitzroySignUp)

module.exports = router
