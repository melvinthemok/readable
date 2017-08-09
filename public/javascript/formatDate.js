function formatDate(date) {
  var dayOfWeek = date.getDay()
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  var dayOfMonth = date.getDate()
  var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var monthIndex = date.getMonth()
  var year = date.getFullYear()
  return dayNames[dayOfWeek] + ', ' + dayOfMonth + ' ' + monthNames[monthIndex] + ' ' + year
}

module.exports = formatDate