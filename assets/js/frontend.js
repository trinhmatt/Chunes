var allTracks = [];


var myGenres = {
  hipHop: {
    isSelected: false,
    //I want to be able to search for any songs that match these keywords
    subgenreSrings: ['rap, hop']
  },
  pop: {
    isSelected: false,
    //I want to be able to search for any songs that match these keywords
    subgenreSrings: ['pop, dream']
  },
  rock: {
    isSelected: false,
    //I want to be able to search for any songs that match these keywords
    subgenreSrings: ['rock, math, garage']
  }
};

var getTunes = $('#get').click(listentothis);

var rightClicked = $('#songList').on('contextmenu', 'a', function(){
  $(this).addClass('clicked')
});

var leftClicked = $('#songList').on('click', 'a', function(){
  $(this).addClass('clicked')
});

var listHover = $("#songList").on("mouseenter", 'a', function() {
  $(this).toggleClass('hover');
}).on('mouseleave', 'a', function() {
  $(this).toggleClass('hover');
});

//Shows and hides the list of genres
var genreToggle = $('#slide').on('click', function(){
  $('.genres').slideToggle(500)
  $('#slide').toggleClass('minus')
  if ($('#slide').hasClass('minus') === true) {
    $('#slide').html('Genres -')
  } else {
    $('#slide').html('Genres +')
  }
})

//Add or remove genre from the list
var genreSelect = $('.genre').on('click', function(){
  //All genre labels have their selector string as their ID
  var genre = ($(this).next().attr('id'))

  //Check or uncheck the corresponding genre from the global object
  myGenres[genre].isSelected = !myGenres[genre].isSelected
})

var buttonHover = $('button').hover(
  function() {
    $(this).toggleClass('bclicked')
  },
  function() {
    $(this).toggleClass('bclicked')
})

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

var titleSort = $("#title").on('click', alphaSort),
    genreSort = $('#genreTable').on('click', alphaSort)


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

//For multi-genre subreddits (listentothis, music)
function retrieve(data,callback) {
  $.each(
    data.data.children,
    function (i, post) {
      for (i=0; i<myGenres.length; i++) {
        //.toLowerCase so I can reduce the amount of loops I have to make
        if (post.data.title.toLowerCase().indexOf(myGenres[i]) > -1) {
          var track = {
            title: post.data.title,
            url: post.data.url,
            ups: post.data.ups,
            genre: myGenres[i]
          }
          window.allTracks.push(track)
        }
      }
    }
  )
  callback();
}

//For genre-specific subreddits (hiphopheads, indieheads, etc.)
function headRetrieve(data, genre, callback) {
  $.each(
    data.data.children,
    function (i, post) {
      if (post.data.title.indexOf('FRESH') > -1) {
        var htrack = {
          title: post.data.title,
          url: post.data.url,
          ups: post.data.ups,
          genre: genre
        }
        window.allTracks.push(htrack)
      }
    }
  )
  callback();
}

function listentothis() {
  //Check if user added genres
  if ($('#allGenres li').length > 0) {
    //Clearing the space on the HTML for the list of songs
    $('#instructions').fadeOut(300)
    $('#loader').fadeIn(300)
    $('#songList').css('display', 'none')
    //To make sure that retrieving tracks more than once does not stack the same list twice
    $('#song2 tr').slice(1).remove()
    window.allTracks = []
    $.getJSON(
    'https://www.reddit.com/r/listentothis/.json?limit=100&after=t3_10omtd/',
    function (data) {
      retrieve(data, r_music)
    });
  } else {
    $('#error-display').slideToggle(300).delay(800).fadeOut(200)
  }
}

function r_music() {
  $.getJSON(
  'https://www.reddit.com/r/music/.json?limit=100&after=t3_10omtd/',
  function (data) {
    retrieve(data, hipFresh);
  }
  )
}

//Refactor this
function hipFresh()  {
  var genre = 'hip hop'
  var hip = false
  for (i=0; i<myGenres.length; i++) {
    if (myGenres[i].indexOf('hip') >= 0) {
      hip = true
    }
  }
  if (hip === true) {
    $.getJSON(
    'https://www.reddit.com/r/hiphopheads.json?limit=100&after=t3_10omtd/',
    function (data) {
      headRetrieve(data, genre, indieFresh)
    })
  } else {
  indieFresh();
  }
}

function indieFresh() {
  var genre = 'indie'
  var indie = false
  for (i=0; i<myGenres.length; i++) {
    if (myGenres[i].indexOf('indie') >= 0) {
      indie = true
    }
  }
  if (indie === true) {
    $.getJSON(
    'https://www.reddit.com/r/indieheads.json?limit=100&after=t3_10omtd/',
    function (data) {
      headRetrieve(data, genre, deDupe)
    })
  } else {
    deDupe();
  }
}

//Removes duplicates
function deDupe() {
  var deDuped = _.uniq(window.allTracks, function(track) {
    return track.title && track.url;
  })
  cleanList(deDuped)
}

//Removes [FRESH] and [GENRE] tags from track titles
function cleanList(deDuped) {
  for (i=0; i<deDuped.length; i++) {
    var track = deDuped[i].title,
        openSquare = track.indexOf('['),
        closeSquare = track.indexOf(']'),
        //To catch the second occurence of [], if any
        openSquare2 = track.indexOf('[',track.indexOf("[") + 1),
        closeSquare2 = track.indexOf(']',track.indexOf("]") + 1)
    if (openSquare !== -1) {
      var firstBracket = track.substring(openSquare,closeSquare+1)
      //Better to replace because the first bracket can occur after the title
      var fixedTitle = track.replace(firstBracket,'')
      if (openSquare2 !== -1) {
        var secondBracket = track.substring(openSquare2, closeSquare2+1)
        fixedTitle = fixedTitle.replace(secondBracket, '')
        deDuped[i].title = fixedTitle
      } else {
        deDuped[i].title = fixedTitle
      }
    }
  }
  add_track(deDuped)
}

//Populates the DOM with the track links
function add_track(deDuped) {
  var tr = '<tr>',
      tr2 = '</tr>',
      td1 = '<td>',
      td2 = '</td>',
      a1 = '<a href=\'',
      a2 = '</a>'
  for (i=0; i<deDuped.length; i++) {
    var ups = td1+deDuped[i].ups+td2,
        title = td1+a1+deDuped[i].url+'\''+'>'+deDuped[i].title+a2+td2,
        genre = td1+deDuped[i].genre+td2
    $('#songList').append(tr+ups+title+genre+tr2)
  }
  //To avoid weird transition behaviour
  $('#loader').fadeOut(200, function(){
    $('#songList').fadeIn(300)
  })
}
