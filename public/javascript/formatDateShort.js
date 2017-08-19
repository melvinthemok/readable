function formatDateShort(date) {
  var dayOfMonth = date.getDate()
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  var monthIndex = date.getMonth()
  var year = date.getFullYear()
  return dayOfMonth + ' ' + monthNames[monthIndex] + ' ' + year
}

module.exports = formatDateShort