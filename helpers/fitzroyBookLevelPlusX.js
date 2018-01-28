function fitzroyBookLevelPlusX (level) {
  level < 41
  ? level % 10 === 1 ||
    level % 10 === 2 ||
    level % 10 === 3 ||
    level % 10 === 4 ||
    level % 10 === 5
    ? level = (level + level % 10) / 2
    : level % 10 === 0
      ? level = level / 2 + 'x'
      : level = (level + level % 10 - 10) / 2 + 'x'
  : level -= 20
  return level.toString()
}

module.exports = fitzroyBookLevelPlusX