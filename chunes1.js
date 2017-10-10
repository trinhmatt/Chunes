var allTracks = [];

var myGenres = [
  'hop',
  'pop',
  'synthpop',
  'soul',
  'rnb',
  'r&b',
  'chill'
];

var getTunes = $('#get').click(listentothis);

var rightClicked = $('ul').on('contextmenu', 'a', function() {
  $(this).addClass('clicked')
});

var leftClicked = $('ul').on('click', 'a', function() {
  $(this).addClass('clicked')
});

function listentothis() {
  //To make sure that hitting the get tracks button more than once doesnt repeat the list
  $('ul').html('')
  window.allTracks = []
  $.getJSON(
  'https://www.reddit.com/r/listentothis/.json?limit=100&after=t3_10omtd/',
  function retrieve(data) {
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
    r_hhh();
  }
  )
}

function r_hhh()  {
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
    r_music();
  }
)
}

function r_music() {
  $.getJSON(
  'https://www.reddit.com/r/music/.json?limit=100&after=t3_10omtd/',
  function retrieve(data) {
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
            window.allTracks.push(track);
          }
        }
      }
    )
    deDupe();
  }
)
}

//Removes duplicates
function deDupe() {
  var deDuped = _.uniq(window.allTracks, function(a) {
    return a.title && a.url;
  })
  add_track(deDuped);
}

function add_track(deDupe) {
  var li1 = '<li>'
  var a1 = '<a href=\''
  var a2 = '</a></li>'
  for (i=0; i<deDupe.length; i++) {
    $('ul').append(li1+a1+deDupe[i].url+'\''+'>'+deDupe[i].title+a2)
  }
}
