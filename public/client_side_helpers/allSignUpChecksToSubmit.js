document.addEventListener('DOMContentLoaded', function () {
  // different listeners for inputs and selects
  var listeningInputs = document.querySelectorAll('.required-group > input, #experience')
  var listeningSelects = document.querySelectorAll('.required-group > select')
  // enable submit only if other client-side helper checks succeed
  var email = document.getElementById('email')
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  var name = document.getElementById('name')
  var phone = document.getElementById('phone')
  var phoneRegex = /^[6, 8, 9]\d{7}$/
  var experience = document.getElementById('experience')
  var password1 = document.getElementById('passwordDraft')
  var password2 = document.getElementById('password')
  var submitButton = document.getElementById('submitButton')

  function allChecksAndToggleSubmitButton () {
    // checking if required form elements have values
    var requiredGroups = document.querySelectorAll('.required-group')
    var required = document.querySelectorAll('.required-group > input, .required-group > select')

    requiredGroups.forEach(function (requiredGroup) {
      var input = requiredGroup.querySelector('input:not(#email):not(#name):not(#phone):not(#passwordDraft):not(#password)')
      // to avoid encroaching on responsibility of individual checks
      var select = requiredGroup.querySelector('select')

      if (input) {
        if (input.value !== '') {
          requiredGroup.classList.add('has-success')
          requiredGroup.classList.remove('has-warning')
          input.classList.add('form-control-success')
          input.classList.remove('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = ''
          }
        } else {
          requiredGroup.classList.remove('has-success')
          requiredGroup.classList.add('has-warning')
          input.classList.remove('form-control-success')
          input.classList.add('form-control-warning')
          if (requiredGroup.querySelector('.form-control-feedback')) {
            requiredGroup.querySelector('.form-control-feedback').textContent = 'Required'
          }
        }
      }

      if (select) {
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
      }
    })

    if (!Array.prototype.some.call(required, function (item) {
      return item.value === ''
    }) && emailRegex.test(email.value) && name.value.length > 2 && name.value.length < 41 && phoneRegex.test(phone.value) && (!experience || experience.value.length < 501) && password1.value.length > 7 && password1.value.length < 31 && password1.value === password2.value) {
      submitButton.removeAttribute('disabled')
      submitButton.setAttribute('style', 'cursor:pointer;')
    } else {
      submitButton.setAttribute('disabled', true)
      submitButton.removeAttribute('style')
    }
  }

  allChecksAndToggleSubmitButton()

  Array.prototype.forEach.call(listeningInputs, function (elem) {
    elem.addEventListener('input', allChecksAndToggleSubmitButton)
  })
  
  Array.prototype.forEach.call(listeningSelects, function (elem) {
    elem.addEventListener('change', allChecksAndToggleSubmitButton)
  })
})
