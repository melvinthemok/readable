document.addEventListener('DOMContentLoaded', function () {
  var phoneFormGroup = document.getElementById('phone-form-group')
  var phone = document.getElementById('phone')
  var message = document.getElementById('phoneLengthMessage')
  var phoneRegex = /^[6, 8, 9]\d{7}$/

  function checkPhone () {
    if (phoneRegex.test(phone.value)) {
      phoneFormGroup.classList.add('has-success')
      phone.classList.add('form-control-success')
      phoneFormGroup.classList.remove('has-warning')
      phone.classList.remove('form-control-warning')
      message.textContent = ''
    } else {
      phoneFormGroup.classList.add('has-warning')
      phone.classList.add('form-control-warning')
      phoneFormGroup.classList.remove('has-success')
      phone.classList.remove('form-control-success')
      message.textContent = 'Please provide a valid phone number, e.g. 91234567, omitting +65'
    }
  }

  checkPhone()
  phone.addEventListener('input', checkPhone)
})
