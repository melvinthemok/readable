var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')

var studentController = {
  new: function (req, res) {
    res.render('student/new')
  },

  preSchool: {
    
    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) throw err
        PreSchool.find({}, function (err, allPreSchools) {
          if (err) throw err
          res.render('student/preSchool/new', {
            allTutors: allTutors,
            allPreSchools: allPreSchools
          })
        })
      })
    },

    create: function (req, res) {
      var newPreSchool = new PreSchool({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        startDate: req.body.startDate,
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        attending: false
      })
      newPreSchool.save(function (err, savedPreSchool) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/student/pre-school/new')
        } else {
          PreSchool.update(
            { _id: { $in: savedPreSchool.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPreSchool.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/student/pre-school/new')
              } else {
                req.flash('success', savedPreSchool.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/pre-school')
              }
            }
          )
        }
      })
    }
  },

  fitzroy: {

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) throw err
        Fitzroy.find({}, function (err, allFitzroys) {
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
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
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
          Fitzroy.update(
            { _id: { $in: savedFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedFitzroy.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/student/fitzroy/new')
              } else {
                req.flash('success', savedFitzroy.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/fitzroy')
              }
            }
          )
        }
      })
    }
  },

  postFitzroy: {
    
    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) throw err
        PostFitzroy.find({}, function (err, allPostFitzroys) {
          if (err) throw err
          res.render('student/postFitzroy/new', {
            allTutors: allTutors,
            allPostFitzroys: allPostFitzroys
          })
        })
      })
    },

    create: function (req, res) {
      var newPostFitzroy = new PostFitzroy({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        family: req.body.family,
        schoolLevel: req.body.schoolLevel,
        startDate: req.body.startDate,
        oneOnOne: req.body.oneOnOne,
        intervention: req.body.intervention,
        preferredTutors: req.body.preferredTutors,
        kidsToAvoid: req.body.kidsToAvoid,
        attending: false
      })
      newPostFitzroy.save(function (err, savedPostFitzroy) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/student/post-fitzroy/new')
        } else {
          PostFitzroy.update(
            { _id: { $in: savedPostFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPostFitzroy.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/student/post-fitzroy/new')
              } else {
                req.flash('success', savedPostFitzroy.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/post-fitzroy')
              }
            }
          )
        }
      })
    }
  }

}

module.exports = studentController
