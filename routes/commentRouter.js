var express = require('express')
var router = express.Router()
var isAdmin = require('../middleware/isAdmin')
var commentController = require('../controllers/commentController')

router.get('/', commentController.index)
router.get('/new', commentController.new)
router.get('/:id', commentController.show)
router.post('/', commentController.create)
router.delete('/:id', isAdmin, commentController.delete)

module.exports = router
