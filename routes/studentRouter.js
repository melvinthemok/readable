var express = require('express')
var router = express.Router()
var isAdminOrCatchPlus = require('../middleware/isAdminOrCatchPlus')
var studentController = require('../controllers/studentController')

router.get('/', studentController.index)
router.get('/new', studentController.new)

router.get('/pre-school', studentController.preSchool.index)
router.get('/pre-school/new', isAdminOrCatchPlus, studentController.preSchool.new)
router.get('/pre-school/:id', studentController.preSchool.show)
router.get('/pre-school/edit/:id', studentController.preSchool.edit)
router.post('/pre-school', isAdminOrCatchPlus, studentController.preSchool.create)
router.put('/pre-school/update/:id', studentController.preSchool.update)

router.get('/fitzroy', studentController.fitzroy.index)
router.get('/fitzroy/new', isAdminOrCatchPlus, studentController.fitzroy.new)
router.get('/fitzroy/:id', studentController.fitzroy.show)
router.get('/fitzroy/edit/:id', studentController.fitzroy.edit)
router.post('/fitzroy', isAdminOrCatchPlus, studentController.fitzroy.create)
router.put('/fitzroy/update/:id', studentController.fitzroy.update)

router.get('/post-fitzroy', studentController.postFitzroy.index)
router.get('/post-fitzroy/new', isAdminOrCatchPlus, studentController.postFitzroy.new)
router.get('/post-fitzroy/:id', studentController.postFitzroy.show)
router.get('/post-fitzroy/edit/:id', studentController.postFitzroy.edit)
router.post('/post-fitzroy', isAdminOrCatchPlus, studentController.postFitzroy.create)
router.put('/post-fitzroy/update/:id', studentController.postFitzroy.update)

module.exports = router