var Saturdate = require('../models/saturdate')
var Fitzroy = require('../models/fitzroy')
var PreSchool = require('../models/preSchool')
var PostFitzroy = require('../models/postFitzroy')
var Tutor = require('../models/tutor')
var formatDateLong = require('../public/client_side_helpers/formatDateLong')

var saturdateController = {
  index: function (req, res) {
    Saturdate.find({}, function (err, allSaturdates) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/')
      } else {
        res.render('history/index', {
          allSaturdates: allSaturdates.sort(function (date1, date2) {
            if (date1.date < date2.date) return -1
            else if (date1.date > date2.date) return 1
            else return 0
          }),
          formatDateLong: formatDateLong
        })
      }
    })
  },

  show: function (req, res) {
    Saturdate.findById(req.params.id, function (err, chosenSaturdate) {
      if (err) {
        req.flash('error', err.toString())
        res.redirect('/')
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
              res.redirect('/')
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
                    res.redirect('/')
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
                          res.redirect('/')
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
                            formatDateLong: formatDateLong
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