const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//view engine is like react or ruby ejs is just a different one.
app.set('view engine', 'ejs');


//use is middleware. middleware must be higher in actions
//bodyParser.urlencoded takes data from form element and
//adds to to body property of request object
app.use(bodyParser.urlencoded({extended: true}));
//teaches server to undersand json
app.use(bodyParser.json());
//this middleware gives our fronend access to public folder
//these files still need to be required in head
app.use(express.static('public'));



//This chunk connects to the mlab database link when the server starts
const MongoClient = require('mongodb').MongoClient;

var db;
MongoClient.connect('mongodb://expressTest:expressTest@ds131119.mlab.com:31119/express', (err, database) => {
  if (err) console.log(err);
  db = database;

  app.listen(3000, () => {
    console.log("Server successfully started!");
  });
});


app.get('/', (req, res) => {
  //cursor is a mongo object with a bunch of shit.
  console.log("request for '/' recieved");

  const cursor = db.collection('list').find();

  // one method cursor contains is toArray() which takes a callback
  // that allows us to do render out that data.  index.ejs is a template //that MUST be located in views folder, second arg is data to provide to
  //template.
  cursor.toArray((err, data) => {
    if (err) console.log(err);
    res.render('index.ejs', {tasks: data});
  });


  //__dirname is essentially pwd
  //code below sent static page, above render is dynamic
  //res.sendFile(__dirname + '/index.html');

});


//db.collection creates and maybe finds the collection which is a POJO
//instead of a table.
//.save saves the bodyParsed req.body to the collection then takes
//a callback func that takes error and success
app.post('/list', (req, res) => {
  console.log("post request recieved at '/list'");
  console.log("data posted -> " +  req.body);

  db.collection('list').save(req.body, (err, succ) => {
    if (err){
      console.log(err);
    } else {
      console.log("Save successful -> " +  succ);
    }

    res.redirect("/");
  });
});

app.put('/list', (req, res) => {
  console.log("put request recieved at '/list'");
  console.log("data updating -> " +  req.body);


  //db queue args are query, update, options, callback
  db.collection('list').updateMany(
    {dueDate :req.body.dateToChange},
    {
      //$set is mongodb
      $set : {
        dueDate : req.body.newDueDate
      }
    },
    {
      upsert: false
    },
    (err, data) => {
      if (err){
        return res.send(err);
      }
      res.send(data);
    }
  );
});

app.delete('/list', (req, res) =>{
  db.collection('list').remove(
    {task: req.body.itemToDelete},
    true
  );
  res.send(200);
});
