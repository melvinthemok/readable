document.addEventListener('DOMContentLoaded', function () {
  var emailFormGroup = document.getElementById('email-form-group')
  var email = document.getElementById('email')
  var message = document.getElementById('emailRegexMessage')
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  email.onkeyup = function () {
    if (emailRegex.test(email.value)) {
      emailFormGroup.classList.add('has-success')
      emailFormGroup.classList.remove('has-warning')
      email.classList.add('form-control-success')
      email.classList.remove('form-control-warning')
      message.textContent = ''
    } else {
      if (!email.classList.contains('form-control-warning') && !emailFormGroup.classList.contains('has-warning')) {
        email.classList.add('form-control-warning')
        emailFormGroup.classList.add('has-warning')
      }
      if (email.classList.contains('form-control-success') && emailFormGroup.classList.contains('has-success')) {
        email.classList.remove('form-control-success')
        emailFormGroup.classList.remove('has-success')
      }
      message.textContent = 'Your email doesn\'t look right'
    }
  }
})
