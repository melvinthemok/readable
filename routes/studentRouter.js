var express = require('express')
var router = express.Router()
var canCreateStudent = require('../middleware/canCreateStudent')
var studentController = require('../controllers/studentController')

router.get('/', studentController.index)
router.get('/new', studentController.new)

router.get('/pre-school', studentController.preSchool.index)
router.get('/pre-school/new', canCreateStudent, studentController.preSchool.new)
router.get('/pre-school/:id', studentController.preSchool.show)
router.post('/pre-school', canCreateStudent, studentController.preSchool.create)

router.get('/fitzroy', studentController.fitzroy.index)
router.get('/fitzroy/new', canCreateStudent, studentController.fitzroy.new)
router.get('/fitzroy/:id', studentController.fitzroy.show)
router.post('/fitzroy', canCreateStudent, studentController.fitzroy.create)

router.get('/post-fitzroy', studentController.postFitzroy.index)
router.get('/post-fitzroy/new', canCreateStudent, studentController.postFitzroy.new)
router.get('/post-fitzroy/:id', studentController.postFitzroy.show)
router.post('/post-fitzroy', canCreateStudent, studentController.postFitzroy.create)

module.exports = router