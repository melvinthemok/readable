// var User = require('../models/user')

// var groupController = {
//   getGroup: function (req, res) {
//     User.find({ role: "teacher", attending: true })
//       .exec(function (err, allAttendingTeachers) {
//         if (err) throw err
//         User.find({ role: "student", attending: true })
//           .exec(function (err, allAttendingStudents) {
//             if (err) throw err
//             res.render('./user/group', {
//               allAttendingTeachers: allAttendingTeachers,
//               allAttendingStudents: allAttendingStudents
//             })
//           })
//       })
//   }
// }

// module.exports = groupController