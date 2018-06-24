document.addEventListener('DOMContentLoaded', function () {
  var submitButton = document.getElementById('submitButton')

  function runAllRequiredChecks () {
    var requiredGroups = document.querySelectorAll('.required-group')
    var required = document.querySelectorAll('.required-group > select')

    requiredGroups.forEach(function (requiredGroup) {
      var select = requiredGroup.querySelector('select')

      if (select.value !== '') {
        requiredGroup.classList.add('has-success')
        requiredGroup.classList.remove('has-warning')
        select.classList.add('form-control-success')
        select.classList.remove('form-control-warning')
        if (requiredGroup.querySelector('.form-control-feedback')) {
          requiredGroup.querySelector('.form-control-feedback').textContent = ''
        }
      } else {
        requiredGroup.classList.remove('has-success')
        requiredGroup.classList.add('has-warning')
        select.classList.remove('form-control-success')
        select.classList.add('form-control-warning')
        if (requiredGroup.querySelector('.form-control-feedback')) {
          requiredGroup.querySelector('.form-control-feedback').textContent = 'Required'
        }
      }
    })

    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    })) {
      submitButton.removeAttribute('disabled')
      submitButton.setAttribute('style', 'cursor:pointer;')
    } else {
      submitButton.setAttribute('disabled', true)
      submitButton.removeAttribute('style')
    }
  }

  runAllRequiredChecks()

  var tutorSelectGroup = document.querySelector("select[name='tutor']").closest("div")

  tutorSelectGroup.addEventListener('change', runAllRequiredChecks)

  var bookSelect = document.querySelector("select[name='book']")
  var completedSelectGroup = document.querySelector("select[name='completed']").closest("div")

  bookSelect.addEventListener('change', function () {
    if (this.value > 0) {
      completedSelectGroup.classList.add('required-group')
      completedSelectGroup.removeAttribute('style')
      completedSelectGroup.addEventListener('change', runAllRequiredChecks)
    } else {
      completedSelectGroup.classList.remove('required-group')
      completedSelectGroup.querySelector('select').selectedIndex = 0
      completedSelectGroup.setAttribute('style', 'display:none; visibility:hidden')
    }
    runAllRequiredChecks()
  })
})
