var express = require('express')
var router = express.Router()
var isAdmin = require('../middleware/isAdmin')
var isTutor = require('../middleware/isTutor')
var commentController = require('../controllers/commentController')

router.get('/', commentController.index)
router.get('/new', isTutor, commentController.new)
router.get('/:id', commentController.show)
router.get('/edit/:id', isTutor, commentController.edit)
router.post('/', isTutor, commentController.create)
router.put('/update/:id', isTutor, commentController.update)
router.delete('/:id', isAdmin, commentController.delete)

module.exports = router
