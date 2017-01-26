const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
//This chunk connects to the mlab database link when the server starts
//
var db;

MongoClient.connect('mongodb://expressTest:expressTest@ds131119.mlab.com:31119/express', (err, database) => {
  if (err) console.log(err);
  db = database;

  app.listen(3000, () => {
    console.log("Server successfully started!");
  });
});

//use is middleware. middleware must be higher in actions
//bodyParser.urlencoded takes data from form element and
//adds to to body property of request object
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  //cursor is a mongo object with a bunch of shit.
  const cursor = db.collection('list').find();

  // one thing cursor contains is toArray() which takes a callback
  // that allows us to do...
  cursor.toArray((err, succ) => {
    console.log(succ);
  });
  //__dirname is essentially pwd
  res.sendFile(__dirname + '/index.html');
});


//db.collection creates and maybe finds the collection which is a POJO
//instead of a table.
//.save saves the bodyParsed req.body to the collection then takes
//a callback func that takes error and success
app.post('/list', (req, res) => {
  db.collection('list').save(req.body, (err, succ) => {
    if (err){
      console.log(err);
    }

    res.redirect("/");
  });
});
