var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')
var Saturdate = require('../models/saturdate')
var formatDateShort = require('../public/client_side_helpers/formatDateShort')
var formatDateLong = require('../public/client_side_helpers/formatDateLong')

var studentController = {
  index: function (req, res) {
    res.render('students/index')
  },

  new: function (req, res) {
    res.render('students/new')
  },

  preSchool: {
    
    index: function (req, res) {
      PreSchool.find({}, function (err, allPreSchools) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/preSchool/index', {
            allPreSchools: allPreSchools
          })
        }
      })
    },

    show: function (req, res) {
      PreSchool.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenPreSchool) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/pre-school')
          } else {
            res.render('students/preSchool/show', {
              chosenPreSchool: chosenPreSchool,
              formatDateShort: formatDateShort
            })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/pre-school')
        } else {
          PreSchool.find({}, function (err, allPreSchools) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/pre-school')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/pre-school')
                } else {
                  res.render('students/preSchool/new', {
                    allTutors: allTutors,
                    allPreSchools: allPreSchools,
                    allSaturdates: allSaturdates.sort(function (date1, date2) {
                      if (date1.date < date2.date) return -1
                      else if (date1.date > date2.date) return 1
                      else return 0
                    }),
                    formatDateLong: formatDateLong
                  })
                }
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
        attendance: typeof req.body.saturdates === 'string'
        ? req.body.preSchoolTutors === 'unknown'
          ? { date: req.body.saturdates }
          : { tutor: req.body.preSchoolTutors, date: req.body.saturdates }
        : req.body.saturdates
          ? req.body.saturdates.map(function (date) {
            var obj = {}
            obj['date'] = date
            req.body.preSchoolTutors[0] === 'unknown'
            ? req.body.preSchoolTutors.shift()
            : obj['tutor'] = req.body.preSchoolTutors.shift()
            return obj
          })
          : [],
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
                res.redirect('/students/pre-school')
              }
            }
          )
        }
      })
    }
  },

  fitzroy: {

    index: function (req, res) {
      Fitzroy.find({}, function (err, allFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/fitzroy/index', {
            allFitzroys: allFitzroys
          })
        }
      })
    },

    show: function (req, res) {
      Fitzroy.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenFitzroy) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/fitzroy')
          } else {
            res.render('students/fitzroy/show', {
              chosenFitzroy: chosenFitzroy,
              formatDateShort: formatDateShort
            })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/fitzroy')
        } else {
          Fitzroy.find({}, function (err, allFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/fitzroy')
                } else {
                  res.render('students/fitzroy/new', {
                    allTutors: allTutors,
                    allFitzroys: allFitzroys,
                    allSaturdates: allSaturdates.sort(function (date1, date2) {
                      if (date1.date < date2.date) return -1
                      else if (date1.date > date2.date) return 1
                      else return 0
                    }),
                    formatDateLong: formatDateLong
                  })
                }
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
        attendance: typeof req.body.fitzroyBooks === 'string'
          ? req.body.fitzroyTutors === 'unknown'
            ? { book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
            : { tutor: req.body.fitzroyTutors, book: req.body.fitzroyBooks, date: req.body.saturdates, completed: req.body.fitzroyCompleted }
          : req.body.fitzroyBooks
            ? req.body.fitzroyBooks.map(function (book) {
              var obj = {}
              req.body.fitzroyTutors[0] === 'unknown'
              ? req.body.fitzroyTutors.shift()
              : obj['tutor'] = req.body.fitzroyTutors.shift()
              obj['book'] = book
              obj['date'] = req.body.saturdates.shift()
              if (req.body.fitzroyCompleted) {
                if (obj['book'] !== '0') {
                  typeof req.body.fitzroyCompleted === 'string'
                    ? obj['completed'] = req.body.fitzroyCompleted
                    : obj['completed'] = req.body.fitzroyCompleted.shift()
                }
              }
              return obj
            })
            : [],
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
                res.redirect('/students/fitzroy')
              }
            }
          )
        }
      })
    }
  },

  postFitzroy: {
    
    index: function (req, res) {
      PostFitzroy.find({}, function (err, allPostFitzroys) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students')
        } else {
          res.render('students/postFitzroy/index', {
            allPostFitzroys: allPostFitzroys
          })
        }
      })
    },

    show: function (req, res) {
      PostFitzroy.findById(req.params.id)
        .populate('kidsToAvoid')
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, chosenPostFitzroy) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/students/post-fitzroy')
          } else {
            res.render('students/postFitzroy/show', {
              chosenPostFitzroy: chosenPostFitzroy,
              formatDateShort: formatDateShort
            })
          }
        })
    },

    new: function (req, res) {
      Tutor.find({}, function (err, allTutors) {
        if (err) {
          req.flash('error', err.toString())
          res.redirect('/students/post-fitzroy')
        } else {
          PostFitzroy.find({}, function (err, allPostFitzroys) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/students/post-fitzroy')
            } else {
              Saturdate.find({}, function (err, allSaturdates) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/students/post-fitzroy')
                } else {
                  res.render('students/postFitzroy/new', {
                    allTutors: allTutors,
                    allPostFitzroys: allPostFitzroys,
                    allSaturdates: allSaturdates.sort(function (date1, date2) {
                      if (date1.date < date2.date) return -1
                      else if (date1.date > date2.date) return 1
                      else return 0
                    }),
                    formatDateLong: formatDateLong
                  })
                }
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
        attendance: typeof req.body.saturdates === 'string'
        ? req.body.postFitzroyTutors === 'unknown'
          ? { date: req.body.saturdates }
          : { tutor: req.body.postFitzroyTutors, date: req.body.saturdates }
        : req.body.saturdates
          ? req.body.saturdates.map(function (date) {
            var obj = {}
            obj['date'] = date
            req.body.postFitzroyTutors[0] === 'unknown'
            ? req.body.postFitzroyTutors.shift()
            : obj['tutor'] = req.body.postFitzroyTutors.shift()
            return obj
          })
          : [],
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
                res.redirect('/students/post-fitzroy')
              }
            }
          )
        }
      })
    }
  }

}

module.exports = studentController
