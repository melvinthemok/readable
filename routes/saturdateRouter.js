var express = require('express')
var router = express.Router()
var saturdateController = require('../controllers/saturdateController')

router.get('/', saturdateController.index)
router.get('/:id', saturdateController.show)
router.post('/', saturdateController.create)
router.delete('/:id', saturdateController.delete)

module.exports = router
