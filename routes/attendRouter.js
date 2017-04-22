const express = require('express')
const router = express.Router()
const attendController = require('../controllers/attendController')

router.get('/', attendController.getAttend)

router.put('/:id', attendController.postAttend)

module.exports = router