const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log("We up and running baby!");
});

app.get('/', (req, res) => {
  // res.send("boom!");

  //__dirname is essentially pwd
  res.sendFile(__dirname + '/index.html');
});
