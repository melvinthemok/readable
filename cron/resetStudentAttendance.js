var PreSchool = require('../models/preSchool')
var Fitzroy = require('../models/fitzroy')
var PostFitzroy = require('../models/postFitzroy')

function resetStudentAttendance () {
  var resetPreSchools = new Promise (function (resolve, reject) {
    PreSchool.update(
      {},
      { $set: { attending: false }},
      { multi: true },
      function (err) {
        if (err) reject(err.toString())
        else resolve('Attendance reset for preSchools')
      }
    )
  })
  var resetFitzroys = new Promise (function (resolve, reject) {
    Fitzroy.update(
      {},
      { $set: { attending: false }},
      { multi: true },
      function (err) {
        if (err) reject(err.toString())
        else resolve('Attendance reset for fitzroys')
      }
    )
  })
  var resetPostFitzroys = new Promise (function (resolve, reject) {
    PostFitzroy.update(
      {},
      { $set: { attending: false }},
      { multi: true },
      function (err) {
        if (err) reject(err.toString())
        else resolve('Attendance reset for postFitzroys')
      }
    )
  })

  return Promise.all([resetPreSchools, resetFitzroys, resetPostFitzroys])
    .then(function (successResponses) {
      successResponses.forEach(function (successResponse) {
        console.log(successResponse)
      })
      console.log('Attendance reset for all students')
    })
    .catch(function (errorResponses) {
      errorResponses.forEach(function (errorResponse) {
        console.log(errorResponse)
      })
    })
}

module.exports = resetStudentAttendance
