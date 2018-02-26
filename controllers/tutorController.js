var Tutor = require('../models/tutor')
var PreSchool = require('../models/preSchool')
var Fitzroy = require('../models/fitzroy')
var PostFitzroy = require('../models/postFitzroy')

var formatDateShort = require('../helpers/formatDateShort')
var sortByProperty = require('../helpers/sortByProperty')
var studentsOfTutor = require('../helpers/studentsOfTutor')
var fitzroyBookLevelPlusX = require('../helpers/fitzroyBookLevelPlusX')

var tutorController = {
  index: function (req, res) {
    Tutor.find({}, function (err, allTutors) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/')
      } else {
        Fitzroy.distinct('attendance.tutor', function (err, fitzroyTutors) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/')
          } else {
            PreSchool.distinct('attendance.tutor', function (err, preSchoolTutors) {
              if (err) {
                req.flash('error', err.toString())
                res.redirect('/')
              } else {
                PostFitzroy.distinct('attendance.tutor', function (err, postFitzroyTutors) {
                  if (err) {
                    req.flash('error', err.toString())
                    res.redirect('/')
                  } else {
                    res.render('tutors/index', {
                      fitzroyTutors: fitzroyTutors,
                      preSchoolTutors: preSchoolTutors,
                      postFitzroyTutors: postFitzroyTutors,
                      allTutors: allTutors.sort(function (tutor1, tutor2) {
                        if (tutor1.name < tutor2.name) return -1
                        else if (tutor1.name > tutor2.name) return 1
                        else return 0
                      })
                    })
                  }
                }) // PostFitzroy fetch
              } // PreSchool else
            }) // PreSchool fetch
          } // Fitzroy else
        }) // Fitzroy fetch
      } // Tutor else
    }) // Tutor.find
  },

  show: function (req, res) {
    Tutor.findById(req.params.id, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/tutors')
      } else {
        PreSchool.find({})
        .populate('preferredTutors')
        .populate({
          path: 'attendance.date',
          model: 'Saturdate'
        })
        .populate({
          path: 'attendance.tutor',
          model: 'Tutor'
        })
        .exec(function (err, allPreSchools) {
          if (err) {
            req.flash('error', err.toString())
            res.redirect('/tutors')
          } else {
            Fitzroy.find({})
              .populate('preferredTutors')
              .populate({
                path: 'attendance.date',
                model: 'Saturdate'
              })
              .populate({
                path: 'attendance.tutor',
                model: 'Tutor'
              })
              .exec(function (err, allFitzroys) {
                if (err) {
                  req.flash('error', err.toString())
                  res.redirect('/tutors')
                } else {
                  PostFitzroy.find({})
                    .populate('preferredTutors')
                    .populate({
                      path: 'attendance.date',
                      model: 'Saturdate'
                    })
                    .populate({
                      path: 'attendance.tutor',
                      model: 'Tutor'
                    })
                    .exec(function (err, allPostFitzroys) {
                      if (err) {
                        req.flash('error', err.toString())
                        res.redirect('/tutors')
                      } else {
                        res.render('tutors/show', {
                          chosenTutor: chosenTutor,
                          allPreSchools: studentsOfTutor(allPreSchools, chosenTutor),
                          allFitzroys: studentsOfTutor(allFitzroys, chosenTutor),
                          allPostFitzroys: studentsOfTutor(allPostFitzroys, chosenTutor),
                          formatDateShort: formatDateShort,
                          fitzroyBookLevelPlusX: fitzroyBookLevelPlusX
                        })
                      }
                    })
                }
              })
          }
        })
      }
    })
  },

  delete: function (req, res) {
    Tutor.findByIdAndRemove(req.params.id, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/tutors')
      } else {
        req.flash('success', chosenTutor.name + ' successfully deleted!')
        res.redirect('/tutors')
      }
    })
  }

}

module.exports = tutorController
