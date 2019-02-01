var express = require('express'),
    axios = require('axios'),
    bodyParser = require('body-parser'),
    app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('assets'));

app.get('/', function(req, res){
  res.render('index')
})

app.post('/api/', function(req, res){
  var obj = {response: 'success'};
  var parsedTracks = [];

  //25 results per query, each key = 1 query
  var numTracks = Object.keys(req.body).length * 25;
  console.log(numTracks)

  // function loadTracks() {
  //   if (numTracks >= trackData.length) {
  //     axios
  //   }
  // }

  for (genre in req.body) {

    axios.get(req.body[genre])
      .then( function(searchResults) {
        var trackData = searchResults.data.data.children // This is an array I need to loop through

        for (var i = 0; i<trackData.length; i++) {
          var track = {
            title: trackData[i].data.title,
            url: trackData[i].data.url,
            ups: trackData[i].data.ups,
            genre: genre
          }
          parsedTracks.push(track)
        }
        //Supposed to parse track data here and push into array
        //But the loop finishes before the calls finish and sends an empty array back
      })
      .catch( function(error) {
        console.log(error)
      })

    trackData.push(placeholder)
  }

  setTimeOut(function() {res.send(trackData)}, 2000);

})

app.listen(process.env.PORT || 5000, function(){
  console.log('Server started')
})
