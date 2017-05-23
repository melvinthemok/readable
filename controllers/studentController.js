var Student = require('../models/student')
var Tutor = require('../models/tutor')

var studentController = {
  getStudentSignUp: function (req, res) {
    Tutor.find({}, function (err, allTutors) {
      if (err) throw err
      Student.find({}, function (err, allStudents) {
        if (err) throw err
        res.render('student/new', {
          allTutors: allTutors,
          allStudents: allStudents
        })
      })
    })
  },

  postStudentSignUp: function (req, res) {
    var newStudent = new Student({
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      family: req.body.family,
      schoolLevel: req.body.schoolLevel,
      startDate: req.body.startDate,
      category: req.body.category,
      preferredTutors: req.body.preferredTutors,
      kidsToAvoid: req.body.kidsToAvoid,
      fitzroyProgress: req.body.fitzroyStartDates.map(function(date, index) {
        var obj = {}
        obj['startDate'] = date
        obj['startDate'] ? obj['book'] = req.body.fitzroyBooks.shift() : obj['book'] = ''
        obj['endDate'] = req.body.fitzroyEndDates[index]
        return obj
      }).filter(function (obj) { return obj['book'] }),
      attending: false
    })
    newStudent.save(function (err, savedStudent) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/student/new')
      } else {
        req.flash('success', req.body.name + ' successfully signed up!')
        res.redirect('/')
      }
    })
  }
}

module.exports = studentController
