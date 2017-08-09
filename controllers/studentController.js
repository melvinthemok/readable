var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')

var studentController = {
  // later change to index view at 'students/' with links to different listalls and news
  new: function (req, res) {
    res.render('students/new')
  },

  preSchool: {
    
    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/new')
          // res.redirect('/students/pre-school')
        } else {
          PreSchool.find({}, function (err, allPreSchools) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/new')
              // res.redirect('/students/pre-school')
            } else {
              res.render('students/preSchool/new', {
                allTutors: allTutors,
                allPreSchools: allPreSchools
              })
            }
          })
        }
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
          res.redirect('/students/pre-school/new')
        } else {
          PreSchool.update(
            { _id: { $in: savedPreSchool.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPreSchool.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/pre-school/new')
              } else {
                req.flash('success', savedPreSchool.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/students/pre-school')
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
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/new')
          // res.redirect('/students/fitzroy')
        } else {
          Fitzroy.find({}, function (err, allFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/new')
              // res.redirect('/students/fitzroy')
            } else {
              res.render('students/fitzroy/new', {
                allTutors: allTutors,
                allFitzroys: allFitzroys
              })
            }
          })
        }
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
          res.redirect('/students/fitzroy/new')
        } else {
          Fitzroy.update(
            { _id: { $in: savedFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedFitzroy.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/fitzroy/new')
              } else {
                req.flash('success', savedFitzroy.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/students/fitzroy')
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
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/new')
          // res.redirect('/students/post-fitzroy')
        } else {
          PostFitzroy.find({}, function (err, allPostFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/new')
              // res.redirect('/students/post-fitzroy')
            } else {
              res.render('students/postFitzroy/new', {
                allTutors: allTutors,
                allPostFitzroys: allPostFitzroys
              })
            }
          })
        }
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
          res.redirect('/students/post-fitzroy/new')
        } else {
          PostFitzroy.update(
            { _id: { $in: savedPostFitzroy.kidsToAvoid }},
            { $addToSet: { kidsToAvoid: savedPostFitzroy.id } },
            { multi: true },
            function (err) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/students/post-fitzroy/new')
              } else {
                req.flash('success', savedPostFitzroy.name + ' successfully signed up!')
                res.redirect('/')
                // res.redirect('/students/post-fitzroy')
              }
            }
          )
        }
      })
    }
  }

}

module.exports = studentController
