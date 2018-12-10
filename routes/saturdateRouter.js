var express = require('express')
var router = express.Router()
var isAdmin = require('../middleware/isAdmin')
var saturdateController = require('../controllers/saturdateController')

router.get('/', saturdateController.index)
router.get('/recent', saturdateController.indexRecent)
router.get('/:id', saturdateController.show)
router.post('/', saturdateController.create)
router.delete('/:id', isAdmin, saturdateController.delete)

module.exports = router
