var Tutor = require('../models/tutor')
var PreSchool = require('../models/preSchool')
var Fitzroy = require('../models/fitzroy')
var PostFitzroy = require('../models/postFitzroy')
var formatDateShort = require('../public/client_side_helpers/formatDateShort')

var tutorController = {
  index: function (req, res) {
    Tutor.find({}, function (err, allTutors) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/')
      } else {
        res.render('tutors/index', {
          allTutors: allTutors
        })
      }
    })
  },

  show: function (req, res) {
    Tutor.findById(req.params.id, function (err, chosenTutor) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/')
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
            res.redirect('/')
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
                  res.redirect('/')
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
                        res.redirect('/')
                      } else {
                        res.render('tutors/show', {
                          chosenTutor: chosenTutor,
                          allPreSchools: allPreSchools.filter(function (preSchool) {
                            return (preSchool.attendance.some(function (indivAttendance) {
                              if (indivAttendance.tutor) {
                                return indivAttendance.tutor.id.toString() ===   chosenTutor.id.toString()
                              }
                            }) || preSchool.preferredTutors.some(function (tutor) {
                              return tutor.equals(chosenTutor.id)
                            }))
                          }),
                          allFitzroys: allFitzroys.filter(function (fitzroy) {
                            return (fitzroy.attendance.some(function (indivAttendance) {
                              if (indivAttendance.tutor) {
                                return indivAttendance.tutor.id.toString() === chosenTutor.id.toString()
                              }
                            }) || fitzroy.preferredTutors.some(function (tutor) {
                              return tutor.equals(chosenTutor.id)
                            }))
                          }),
                          allPostFitzroys: allPostFitzroys.filter(function (postFitzroy) {
                            return (postFitzroy.attendance.some(function (indivAttendance) {
                              if (indivAttendance.tutor) {
                                return indivAttendance.tutor.id.toString() === chosenTutor.id.toString()
                              }
                            }) || postFitzroy.preferredTutors.some(function (tutor) {
                              return tutor.equals(chosenTutor.id)
                            }))
                          }),
                          formatDateShort: formatDateShort
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
        res.redirect('/tutor')
      } else {
        req.flash('success', chosenTutor.name + ' successfully deleted!')
        res.redirect('/tutor')
      }
    })
  }

}

module.exports = tutorController