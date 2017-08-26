var express = require('express')
var router = express.Router()
var tutorController = require('../controllers/tutorController')

router.get('/', tutorController.index)
router.get('/:id', tutorController.show)
router.delete('/:id', tutorController.delete)

module.exports = router