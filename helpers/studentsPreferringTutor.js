function studentsPreferringTutor (students, givenTutor) {
  return students.filter(function (student) {
    return (student.preferredTutors.some(function (preferredTutor) {
      return preferredTutor.equals(givenTutor.id)
    }))
  })
}

module.exports = studentsPreferringTutor
