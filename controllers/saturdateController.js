var Saturdate = require('../models/saturdate')
var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Comment = require('../models/comment')
var Tutor = require('../models/tutor')

var formatDateLong = require('../helpers/formatDateLong')
var sortByProperty = require('../helpers/sortByProperty')
var fitzroyBookLevelPlusX = require('../helpers/fitzroyBookLevelPlusX')

var saturdateController = {
  index: function (req, res) {
    Saturdate.find({}, function (err, allSaturdates) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/index')
      } else {
        res.render('history/index', {
          allSaturdates: sortByProperty(allSaturdates, 'date', true),
          formatDateLong: formatDateLong
        })
      }
    })
  },

  show: function (req, res) {
    Saturdate.findById(req.params.id, function (err, chosenSaturdate) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/history')
      } else {
        PreSchool.find({})
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
              res.redirect('/history')
            } else {
              Fitzroy.find({})
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
                    res.redirect('/history')
                  } else {
                    PostFitzroy.find({})
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
                          res.redirect('/history')
                        } else {
                          Comment.find({})
                            .populate({
                              path: 'date',
                              model: 'Saturdate'
                            })
                            .exec(function (err, allComments) {
                              if (err) {
                                req.flash('error', err.toString())
                                res.redirect('/history')
                              } else {
                                Tutor.find({})
                                  .populate({
                                    path: 'attendance.date',
                                    model: 'Saturdate'
                                  })
                                  .exec(function (err, allTutors) {
                                    if (err) {
                                      req.flash('error', err.toString())
                                      res.redirect('/history')
                                    } else {
                                      res.render('history/show', {
                                        chosenSaturdate: chosenSaturdate,
                                        allPreSchools: allPreSchools.filter(function (preSchool) {
                                          return preSchool.attendance.some(function (indivAttendance) {
                                            return indivAttendance.date.id.toString() === chosenSaturdate.id.toString()
                                          })
                                        }),
                                        allFitzroys: allFitzroys.filter(function (fitzroy) {
                                          return fitzroy.attendance.some(function (indivAttendance) {
                                            return indivAttendance.date.id.toString() === chosenSaturdate.id.toString()
                                          })
                                        }),
                                        allPostFitzroys: allPostFitzroys.filter(function (postFitzroy) {
                                          return postFitzroy.attendance.some(function (indivAttendance) {
                                            return indivAttendance.date.id.toString() === chosenSaturdate.id.toString()
                                          })
                                        }),
                                        allComments: allComments.filter(function (comment) {
                                          return comment.date.id.toString() === chosenSaturdate.id.toString()
                                        }),
                                        allTutors: allTutors.filter(function (tutor) {
                                          return tutor.attendance.some(function (indivAttendance) {
                                            return indivAttendance.date.id.toString() === chosenSaturdate.id.toString()
                                          })
                                        }),
                                        formatDateLong: formatDateLong,
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
            }
          })
      }
    })
  },

  create: function (req, res) {
    Saturdate.findOne({ date: req.body.date }, function (err, sameSaturdate) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/history')
      } else {
        if (sameSaturdate) {
          req.flash('error', 'A session on that date already exists')
          res.redirect('/history')
        } else {
          var newSaturdate = new Saturdate({
            date: req.body.date
          })
          newSaturdate.save(function (err, savedSaturdate) {
            if (err) {
              req.flash('error', err.toString())
              res.redirect('/history')
            } else {
              req.flash('success', formatDateLong(savedSaturdate.date) + ' successfully added!')
              res.redirect('/history')
            }
          })
        }
      }
    })
  },

  delete: function (req, res) {
    Saturdate.findByIdAndRemove(req.params.id, function (err, chosenSaturdate) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/history')
      } else {
        req.flash('success', formatDateLong(chosenSaturdate.date) + ' successfully deleted!')
        res.redirect('/history')
      }
    })
  }

}

module.exports = saturdateController
