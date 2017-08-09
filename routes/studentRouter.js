var express = require('express')
var router = express.Router()
var canCreateStudent = require('../middleware/canCreateStudent')
var studentController = require('../controllers/studentController')

router.get('/new', studentController.new)
// later change to
// router.get('/', studentController.getStudentOverview)
// with links to below

// router.get('/fitzroy', studentController.getFitzroyOverview)
// router.get('/pre-school', studentController.getPreSchoolOverview)
// router.get('/post-fitzroy', studentController.getPostFitzroyOverview)



router.get('/pre-school/new', canCreateStudent, studentController.preSchool.new)
router.post('/pre-school', canCreateStudent, studentController.preSchool.create)

router.get('/fitzroy/new', canCreateStudent, studentController.fitzroy.new)
router.post('/fitzroy', canCreateStudent, studentController.fitzroy.create)

router.get('/post-fitzroy/new', canCreateStudent, studentController.postFitzroy.new)
router.post('/post-fitzroy', canCreateStudent, studentController.postFitzroy.create)

module.exports = router
