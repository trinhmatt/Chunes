var express = require('express'),
    app = express();

app.set('view engine', 'ejs');
app.use(express.static('assets'));

app.get('/', function(req, res){
  res.render('index')
})


app.listen(process.env.PORT || 5000, function(){
  console.log('Server started')
})
