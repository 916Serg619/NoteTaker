// Dependencies

var express = require("express");
var path = require("path");
var fs = require("fs");
var db = require("./Develop/db/db.json");
const shortid = require("shortid");



// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 5000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Displays notes
app.get("/api/notes", function (req, res) {
  return res.json(db);
});

// Saving notes to DB.
app.post("/api/notes", function (req, res) {
  console.log(req.body);
  var newNote = {
    id: shortid.generate(),
    title: req.body.title,
    text: req.body.text,
  };
  console.log(newNote);
  db.push(newNote);
  fs.writeFile("./Develop/db/db.json", JSON.stringify(db), function (err) {
    if (err) throw err;
    return res.json(db);
  });
});

// Deleting notes
app.delete("/api/notes/:id", function (req, res) {
    console.log(req.params.id);
    var id =req.params.id;
    db.splice(id -1, 1);
    db.forEach((obj, i) => {
      obj.id = i + 1;
    });
    fs.writeFile("./Develop/db/db.json", JSON.stringify(db), function () {
      res.json(db);
    });
  });  

    

// Starts the server to begin listening
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
