var express = require('express')
var router = express.Router()
var saturdateController = require('../controllers/saturdateController')

router.get('/', saturdateController.listAll)
router.post('/', saturdateController.create)
router.delete('/:id', saturdateController.delete)

module.exports = router
