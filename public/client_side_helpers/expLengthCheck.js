document.addEventListener('DOMContentLoaded', function () {
  var experienceFormGroup = document.getElementById('experience-form-group')
  var experience = document.getElementById('experience')
  var message = document.getElementById('experienceMessage')

  experience.addEventListener('input', function () {
    if (experience.value.length < 501) {
      experienceFormGroup.classList.add('has-success')
      experience.classList.add('form-control-success')
      experienceFormGroup.classList.remove('has-warning')
      experience.classList.remove('form-control-warning')
      message.textContent = 'Characters remaining: ' + (500 - experience.value.length)
    } else {
      experienceFormGroup.classList.add('has-warning')
      experience.classList.add('form-control-warning')
      experienceFormGroup.classList.remove('has-success')
      experience.classList.remove('form-control-success')
      message.textContent = 'Too much information'
    }
  })
})
