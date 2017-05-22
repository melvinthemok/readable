document.addEventListener('DOMContentLoaded', function () {
  for (var i = 1; i < 61; i++) {
    (function (j) {
      var fitzroyBooksDoneCheckbox = document.getElementById('fitzroyBooksDone.' + j + '.book')
      var fitzroyBooksDoneDateInput = document.getElementById('fitzroyBooksDone.' + j + '.date')
      fitzroyBooksDoneCheckbox.onchange = function () {
        if (this.checked) { 
          fitzroyBooksDoneDateInput.removeAttribute('style') 
          fitzroyBooksDoneDateInput.setAttribute(
            'value', 
            new Date().getFullYear().toString() + 
            '-' + 
            ((new Date().getMonth()+1).toString().length < 2 ? '0' + (new Date().getMonth()+1).toString() : (new Date().getMonth()+1).toString()) + 
            '-' + 
            ((new Date().getDate()+1).toString().length < 2 ? '0' + (new Date().getDate()).toString() : (new Date().getDate()).toString())
          )
        } else { 
          fitzroyBooksDoneDateInput.setAttribute('style', 'display:none; visibility:hidden')
          fitzroyBooksDoneDateInput.removeAttribute('value')
        }
      }
    }(i))
  }
})
