function fitzroyBookLevelPlusX (level) {
  var num
  level % 10 === 1 ||
  level % 10 === 2 ||
  level % 10 === 3 ||
  level % 10 === 4 ||
  level % 10 === 5
  ? num = (level + level % 10) / 2
  : level % 10 === 0
    ? num = level / 2 + 'x'
    : num = (level + level % 10 - 10) / 2 + 'x'
  return num.toString()
}

module.exports = fitzroyBookLevelPlusX