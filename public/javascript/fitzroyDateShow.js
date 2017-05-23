document.addEventListener('DOMContentLoaded', function () {
  for (var i = 1; i < 61; i++) {
    (function (j) {
      var fitzroyBooksCheckbox = document.getElementById('fitzroy.' + j + '.book')
      var fitzroyDateFormGroupsDiv = document.getElementById('fitzroy.' + j + '.dates')
      var fitzroyStartDate = document.getElementById('fitzroy.' + j + '.startDate')
      fitzroyBooksCheckbox.onchange = function () {
        if (this.checked) { 
          fitzroyDateFormGroupsDiv.removeAttribute('style')
          fitzroyStartDate.setAttribute(
            'value', 
            new Date().getFullYear().toString() + 
            '-' + 
            ((new Date().getMonth()+1).toString().length < 2 ? '0' + (new Date().getMonth()+1).toString() : (new Date().getMonth()+1).toString()) + 
            '-' + 
            ((new Date().getDate()+1).toString().length < 2 ? '0' + (new Date().getDate()).toString() : (new Date().getDate()).toString())
          )
        } else {
          fitzroyDateFormGroupsDiv.setAttribute('style', 'display:none; visibility:hidden')
          fitzroyStartDate.removeAttribute('value')
        }
      }
    }(i))
  }
})
