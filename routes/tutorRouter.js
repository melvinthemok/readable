var express = require('express')
var router = express.Router()
var isCurrentUser = require('../middleware/isCurrentUser')
var tutorController = require('../controllers/tutorController')

router.get('/', tutorController.index)
router.get('/attendance', tutorController.attendance.index)

router.get('/:id', tutorController.show)
router.delete('/:id', tutorController.delete)

router.get('/attendance/:id', tutorController.attendance.edit)
router.put('/attendance/:id', isCurrentUser, tutorController.attendance.update)

module.exports = router