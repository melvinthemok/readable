var Fitzroy = require('../models/fitzroy')
var Tutor = require('../models/tutor')

var studentController = {
  new: function (req, res) {
    res.render('student/new')
  },

  fitzroy: {

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) throw err
        Fitzroy.find({}, function (err, allStudents) {
          if (err) throw err
          res.render('student/fitzroy/new', {
            allTutors: allTutors,
            allFitzroys: allFitzroys
          })
        })
      })
    },

    create: function (req, res) {
      var newFitzroy = new Fitzroy({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        schoolLevel: req.body.schoolLevel,
        startDate: req.body.startDate,
        category: req.body.category,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        progress: req.body.fitzroyStartDates.map(function (date, index) {
          var obj = {}
          obj['startDate'] = date
          !obj['startDate']
            ? obj['book'] = ''
            : typeof req.body.fitzroyBooks === 'string'
              ? obj['book'] = req.body.fitzroyBooks
              : obj['book'] = req.body.fitzroyBooks.shift()
          obj['endDate'] = req.body.fitzroyEndDates[index]
          return obj
        }).filter(function (obj) { return obj['book']}),
        attending: false
      })
      newFitzroy.save(function (err, savedFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/student/fitzroy/new')
        } else {
          req.flash('success', req.body.name + ' successfully signed up!')
          res.redirect('/')
        // res.redirect('/fitzroy')
        }
      })
    }
  }
}

module.exports = studentController
