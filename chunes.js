//TO DO: Add more genre specific subreddits (indieheads, popheads, etc..)
var allTracks = [];
var myGenres = [];

var getTunes = $('#get').click(listentothis);

var rightClicked = $('#songList').on('contextmenu', 'a', function() {
  $(this).addClass('clicked')
});

var leftClicked = $('#songList').on('click', 'a', function() {
  $(this).addClass('clicked')
});

var genreToggle = $('#slide').on('click', function(){
  $('.genres').slideToggle(500)
})

var buttonHover = $('button').hover(
  function() {
    $(this).toggleClass('bclicked')
  },
  function() {
    $(this).toggleClass('bclicked')
  })


var addGenre = $('#genre').keypress(function(e){
  var l1 = '<li>'
  var l2 = '</li>'
  var delBtn = '<span><i class="fa fa-trash" aria-hidden="true"></i></span>'
  var genre = $('#genre').val()
  if (e.which == 13 && genre !== '') {
    genre = genre.toLowerCase()
    myGenres.push(genre)
    $('#allGenres').append(l1+delBtn+genre+l2)
    $('#allGenres li:last-child').fadeIn(400)
    $('#genre').val('')
  }
})

var deleteGenre = $('#allGenres').on('click', 'span', function(event){
  $(this).parent().fadeOut(400, function(){
    $(this).remove()
  })
  //To select the adjacent text
  var text = $(this).parent().first().contents().filter(function() {
    return this.nodeType == 3;
  }).text()
  for (i=0; i<myGenres.length; i++) {
    if (myGenres[i] === text) {
      myGenres.splice(i, 1)
    }
  }
});


function retrieve(data,callback) {
  $.each(
    data.data.children,
    function (i, post) {
      for (i=0; i<myGenres.length; i++) {
        //.toLowerCase so I can reduce the amount of loops I have to make
        if (post.data.title.toLowerCase().indexOf(myGenres[i]) >= 0) {
          var track = {
            title: post.data.title,
            url: post.data.url,
          }
          window.allTracks.push(track)
        }
      }
    }
  )
  callback();
}

function listentothis() {
  //To make sure that hitting the get tracks button more than once doesnt repeat the list
  $('#songList').html('')
  window.allTracks = []
  $.getJSON(
  'https://www.reddit.com/r/listentothis/.json?limit=100&after=t3_10omtd/',
  function (data) {
    retrieve(data, r_music)
  });
}

function r_music() {
  $.getJSON(
  'https://www.reddit.com/r/music/.json?limit=100&after=t3_10omtd/',
  function (data) {
    retrieve(data, r_hhh);
  }
  )
}

function r_hhh()  {
  var hip = false
  for (i=0; i<myGenres.length; i++) {
    if (myGenres[i].indexOf('hip') >= 0) {
      hip = true
    }
  }
  if (hip === true) {
    $.getJSON(
    'https://www.reddit.com/r/hiphopheads.json?limit=100&after=t3_10omtd/',
    function a(data) {
      $.each(
        data.data.children,
        function (i, post) {
          if (post.data.title.indexOf('FRESH')>=0) {
            var htrack = {
              title: post.data.title,
              url: post.data.url,
            }
            window.allTracks.push(htrack)
          }
        }
      )
      deDupe();
    }
  )
  } else {
    deDupe();
  }
}

//Removes duplicates
function deDupe() {
  var deDuped = _.uniq(window.allTracks, function(a) {
    return a.title && a.url;
  })
  add_track(deDuped)
}

function add_track(deDupe) {
  var li1 = '<li>'
  var a1 = '<a href=\''
  var a2 = '</a></li>'
  for (i=0; i<deDupe.length; i++) {
    $('#songList').append(li1+a1+deDupe[i].url+'\''+'>'+deDupe[i].title+a2)
  }
}
