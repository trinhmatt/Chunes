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
  var obj = {response: 'success'}
  console.log(req.body)
  res.send(obj)

})

app.listen(process.env.PORT || 5000, function(){
  console.log('Server started')
})
