//Sort song list by net upvotes
var upsSort = $('#sort').on('click', function(){
  var sorting = true,
      table = document.getElementById('song2'),
      dir = 'dsc',
      count = 0
  while (sorting) {
    sorting = false;
    rows = table.getElementsByTagName('tr')
    for (i=1; i<rows.length-1; i++){
      var shouldSwitch = false,
          x = rows[i].firstChild.textContent,
          y = rows[i+1].firstChild.textContent,
          intX = parseInt(x),
          intY = parseInt(y)
      if (dir === 'dsc') {
        if (intX < intY) {
          shouldSwitch = true
          break;
        }
      } else if (dir === 'asc') {
        if (intX > intY) {
          shouldSwitch = true
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
      sorting = true
      count ++
    } else if (dir === 'dsc' && count === 0) {
      sorting = true
      dir = 'asc'
    }
  }
})

function alphaSort(event){
  var sorting = true,
      table = document.getElementById('song2'),
      dir = 'dsc',
      count = 0
  while (sorting) {
    sorting = false;
    rows = table.getElementsByTagName('tr')
    for (i=1; i<rows.length-1; i++){
      if (this.textContent === 'Title') {
        var shouldSwitch = false,
            x = rows[i].firstChild,
            y = rows[i+1].firstChild,
            test1 = x.nextSibling.textContent.toLowerCase(),
            test2 = y.nextSibling.textContent.toLowerCase()
      } else {
        var shouldSwitch = false,
            test1 = rows[i].lastChild.textContent,
            test2 = rows[i+1].lastChild.textContent
      }

      if (dir === 'dsc') {
        if (test1 < test2) {
          shouldSwitch = true
          break;
        }
      } else if (dir === 'asc') {
        if (test1 > test2) {
          shouldSwitch = true
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i])
      sorting = true
      count ++
    } else if (dir === 'dsc' && count === 0) {
      sorting = true
      dir = 'asc'
    }
  }
}

module.exports.upsSort = upsSort
module.exports.alphaSort = alphaSort
