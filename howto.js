/*
  ** Author: Collin James, CS 290
  ** Date: 5/18/16
  ** Description: Activity: How-to Guide, node server code
*/

/* set up express */
var express = require('express');
var app = express();

/* set up handlebars*/
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3002);
var homevars = {rndm:null};

/* set up body parser*/
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* send js and css */
app.get('/main.css', function (req, res) {
  res.sendFile(__dirname + '/main.css');
});
app.get('/interaction.js', function (req, res) {
  res.sendFile(__dirname + '/interaction.js');
});

/* handle images */
var IMAGES = ['newapp.jpg', 'final.jpg'];

IMAGES.forEach(function (name) {
  app.get('/images/'+name, function (req, res) {
    res.sendFile(__dirname + '/images/'+name);
  });
})

/* handle main pages */
app.get('/', function (req, res){
  res.type('html');
  var qry = req.query,
      thetopic = qry.topic,
      thetitle = capitalize(thetopic.replace(/_/g, ' '));
  
  res.render(thetopic+'.handlebars', {title: thetitle, topic: thetopic});
})

/* handle errors */
app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found ya\'ll');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

/* start the server */
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to quit.');
});

/* return an object from a query string; pass a node request object */
function getQueryString (req) {
  // console.log(req.query);
  var list = {},
      context = {};
  for (var p in req.query)
    list.p = req.query[p];
  
  return list; // must use same array name (here dataList) in handlebars file
}

function capitalize(string) {
  return string.replace(/\b\w/g, function (ch) {
    return ch.toUpperCase();
  });
}