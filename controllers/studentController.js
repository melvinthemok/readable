var Student = require('../models/student')

var studentController = {
  getStudentSignUp: function (req, res) {
    res.render('student/new')
  },

  postStudentSignUp: function (req, res) {
    var newStudent = new Student({
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
      schoolLevel: req.body.schoolLevel,
      startDate: req.body.startDate,
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
