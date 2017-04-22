var express = require('express')
var router = express.Router()
var attendController = require('../controllers/attendController')

router.get('/', attendController.getAttend)

router.put('/:id', attendController.postAttend)

module.exports = router