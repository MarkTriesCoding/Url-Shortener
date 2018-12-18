

var express = require('express');
var app = express();


var bodyParser = require('body-parser');
var cors = require('cors');
var mongodbUri = require('mongodb-uri');

// var mongo = require('mongodb');
var mongoose = require('mongoose');
var entry = require('./models/entry');
var isUrl = require('is-url');

app.use(cors());
app.use(bodyParser.urlencoded({'extended':false}));



app.use('/public', express.static(process.cwd()+ '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

// Basic Configuration
var mongoURL = 'mongodb://localhost/entrys';
var port =  3000;
console.log(mongoURL);

var options = {

  useNewUrlParser: true};
mongoose.connect(mongoURL, options);
//   if (err) {
//     console.log(err);
//     return err;}
//
//   else console.log("works")
// });

var db = mongoose.connection;

db.on('error',console.error.bind(console,'MongoDB connection error:'));
db.once('open',(callback)=>{
  console.log("Successful Connection");
})

// app.post('/api/shorturl/new',urlHandler.addUrl);

app.get('/api/shorturl/new/:urlToShorten(*)',(req,res,next)=>{
  // var for input url


  var urlToShorten = req.params.urlToShorten;

  if (urlToShorten.length===0){return res.json({"Url":"Empty"});}
    //shortUrlCreator

    //////comment out for working version//////
    entry.findOne({'originalUrl':urlToShorten},(err,storedData)=>{
      if (err) return;
        else if(storedData){
          res.json({"id":storedData.id,"originalUrl": urlToShorten, "shortUrl":storedData.shortUrl});}
    else{

          //////comment out for working version//////
          var shortUrl = Math.floor(Math.random()*10000000).toString();

//Check if URL is legitimate, if so create new entry
          var http = "http://";
//test logs -- can remove
          console.log(urlToShorten);
          console.log(isUrl(urlToShorten)||isUrl(http.concat(urlToShorten)));

          data = new entry(
              {
                  originalUrl:urlToShorten,
                  shortUrl:shortUrl
              });
          data.save((err)=>{
              if (err) return err;
              else{console.log("data saved.")}
          });
          if((isUrl(urlToShorten)||isUrl(http.concat(urlToShorten))))
          {
              return res.json(data);
          }
          else
          {
              return res.json(
                  {
                      originalUrl:"Invalid",
                      shortUrl:"N/A"
                  });
          }
          //check if legitimate URL


      }
    });

});

app.get('/api/:urlToForward',(req,res,next)=>{
  var urlToForward = req.params.urlToForward;
//
//   entry.findOne({"shorturl":urlToForward},(err,StoredData)=>{
//       if(err) return;
//       if(!StoredData){
//           return res.send("Short Url Not Present");
//
// }
// })

  if(urlToForward.toString().length >0 ){
    entry.findOne({'shortUrl':urlToForward},(err,data)=>{
      //err case for query
      if(err) return res.send('Error Reading Database');
      //data case
        if(data){
      var regex = /^(http|https):\/\//i;
      if(regex.test(data.originalUrl)===true){
          res.redirect(301,data.originalUrl)
      }
      else{
          res.redirect(301,'http://' + data.originalUrl)
      }}
      else{
          res.json({"error":"No shortUrl found for input"})
      }
  })}

});



//get, post, use for wrong routes
app.use((req,res,next)=>{
  res.status(404);
  res.type('txt').send('Not found');

})

// your first API endpoint...


app.listen(port, function () {
  console.log('Node.js listening ...');
});