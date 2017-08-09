var mongoose = require('mongoose')

var SaturdateSchema = new mongoose.Schema({
  date: {
    type: Date
  }
})

var Saturdate = mongoose.model('Saturdate', SaturdateSchema)

module.exports = Saturdate