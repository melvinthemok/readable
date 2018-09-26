document.addEventListener('DOMContentLoaded', function () {
  var archiveCheck = document.getElementById('archiveCheck')
  var name = document.getElementById('targetArchiveCheck').getAttribute('data-target-name')
  var archiveButton = document.getElementById('archiveButton')

  var checkAndToggleArchiveButton = function () {
    if (archiveCheck.value === name) {
      archiveButton.removeAttribute('disabled')
      archiveButton.setAttribute('style', 'cursor:pointer;')
    } else {
      archiveButton.setAttribute('disabled', true)
      archiveButton.removeAttribute('style')
    }
  }

  archiveCheck.addEventListener('input', checkAndToggleArchiveButton)
})
