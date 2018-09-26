var express = require('express')
var router = express.Router()
var isTutor = require('../middleware/isTutor')
var isCurrentUser = require('../middleware/isCurrentUser')
var isAdmin = require('../middleware/isAdmin')
var tutorController = require('../controllers/tutorController')

router.get('/', tutorController.index)
router.get('/archived', tutorController.indexArchived)
router.get('/attendance', tutorController.attendance.index)

router.get('/:id', tutorController.show)
router.get('/edit/:id', isTutor, isCurrentUser, tutorController.edit)
router.put('/update/:id', isTutor, isCurrentUser, tutorController.update)
router.put('/archive/:id', isAdmin, tutorController.archive)

router.get('/attendance/:id', tutorController.attendance.edit)
router.put('/attendance/:id', isTutor, isCurrentUser, tutorController.attendance.update)

module.exports = router
