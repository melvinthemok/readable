function studentsOfTutor (students, givenTutor) {
  return students.filter(function (student) {
    return (student.attendance.some(function (indivAttendance) {
      if (indivAttendance.tutor) {
        return indivAttendance.tutor.id.toString() === givenTutor.id.toString()
      }
    }))
  })
}

module.exports = studentsOfTutor
