document.addEventListener('DOMContentLoaded', function () {
  var emailFormGroup = document.getElementById('email-form-group')
  var email = document.getElementById('email')
  var message = document.getElementById('emailRegexMessage')
  var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  function checkEmail () {
    if (emailRegex.test(email.value)) {
      emailFormGroup.classList.add('has-success')
      email.classList.add('form-control-success')
      emailFormGroup.classList.remove('has-warning')
      email.classList.remove('form-control-warning')
      message.textContent = ''
    } else {
      emailFormGroup.classList.add('has-warning')
      email.classList.add('form-control-warning')
      emailFormGroup.classList.remove('has-success')
      email.classList.remove('form-control-success')
      if (email.value.length === 0) {
        message.textContent = 'Required'
      } else {
        message.textContent = 'Your email doesn\'t look right'
      }
    }
  }

  checkEmail()
  email.addEventListener('input', checkEmail)
})
