const express = require("express");
const cors = require("cors");
require('dotenv').config();
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const { authUser } = require('./basicAuth')

const { users } = require('./data');
const url = process.env.DB_PATH;
app.use(setUser);



//save student
app.post("/save_student", function (req, res) {
  var studentName = req.body.name;
  var studentNumber = req.body.number;
  console.log(studentNumber);
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var dbo = client.db("portal");

  
      dbo.collection("student", function (err, collection) {
        collection.insertOne({
          name: studentName,
          mobile: studentNumber,
          is_deleted: false
        });
      });
    });
});


//save librarian
app.post("/save_librarian", function (req, res) {
  var librarianName = req.body.name;
  var librarianNumber = req.body.number;
  console.log(librarianNumber)
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var dbo = client.db("portal");

  
      dbo.collection("librarian", function (err, collection) {
        collection.insertOne({
          name: librarianName,
          mobile: librarianNumber,
          is_deleted: false
        });
      });
    });
});


//save book
app.post("/save_books", function (req, res) {
 let bookName = req.body.bookName;
 let author = req.body.author;
 let price = req.body.price;
 let date = req.body.date;
  console.log(bookName);
    MongoClient.connect(url, function (err, client) {
      if (err) throw err;
      var dbo = client.db("portal");

  
      dbo.collection("books", function (err, collection) {
        collection.insertOne({
          bookName: bookName,
          author: author,
          price: price,
          date: date,
          is_deleted: false
        });
      });
    });
});

//get student by mobile
app.get("/student/:number?", (req, res, next) => {

  var number = req.params.number;
  var query = {
    mobile: number,
    is_deleted: false
  };
  console.log(query);
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("portal");

    dbo
      .collection("student")
      .find(query)
      .toArray(function(err, result) {
        if (err){
          console.log(err);
        } else{
          res.send(result);
        }
        
      });
  });

});

//get librarian with mobile and json
app.get("/librarian/:number?",authUser, (req, res, next) => {

  var number = req.params.number;
  var query = {
    mobile: number,
    is_deleted: false
  };
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("portal");

    dbo
      .collection("librarian")
      .find(query)
      .toArray(function(err, result) {
        if (err){
          console.log(err);
        } else{
          res.send(result);
        }
        
      });
  });

});

//get book by book name
app.get("/bookByName/:bookName?", (req, res, next) => {

  var bookName = req.params.bookName;
  var query = {
    bookName: bookName,
    is_deleted: false
  };
 
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("portal");

    dbo
      .collection("books")
      .find(query)
      .toArray(function(err, result) {
        if (err){
          console.log(err);
        } else{
          res.send(result);
        }
        
      });
  });

});

//get book by author name
app.get("/bookByAuthor/:author?", (req, res, next) => {

  var author = req.params.author;
  console.log(author);
  var query = {
    author: author,
    is_deleted: false
  };
 
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("portal");

    dbo
      .collection("books")
      .find(query)
      .toArray(function(err, result) {
        if (err){
          console.log(err);
        } else{
          res.send(result);
        }
        
      });
  });

});

//Update student

app.post("/edit_student", function (req, res) {
  
    var o_id = new ObjectId(req.body.id);
  console.log(o_id);
  console.log(req.body.number);

    MongoClient.connect(url, function (err, client) {
      var dbo = client.db("portal");

      dbo.collection("student").updateOne(
        {
          _id: o_id,
        },
        {
          $set: {
            name: req.body.name,
            mobile: req.body.number,
          },
        }
      );
    });

    
});

//update librarian
app.post("/edit_librarian", function (req, res) {
  
  var o_id = new ObjectId(req.body.id);
console.log(o_id);
console.log(req.body.number);

  MongoClient.connect(url, function (err, client) {
    var dbo = client.db("portal");

    dbo.collection("librarian").updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          name: req.body.name,
          mobile: req.body.number,
        },
      }
    );
  });

  
});

//update book details
app.post("/edit_book", function (req, res) {
  
  var o_id = new ObjectId(req.body.id);


  MongoClient.connect(url, function (err, client) {
    var dbo = client.db("portal");

    dbo.collection("books").updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          bookName: req.body.bookName,
          author: req.body.author,
          price: req.body.price,
          date: req.body.price
        },
      }
    );
  });

  
});


//delete student from api not from database
app.post("/delete_student", function (req, res) {
  
  var o_id = new ObjectId(req.body.id);


  MongoClient.connect(url, function (err, client) {
    var dbo = client.db("portal");

    dbo.collection("student").updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          is_deleted:true
        },
      }
    );
  });

  
});


//delete librarian from api not from database
app.post("/delete_librarian", function (req, res) {
  
  var o_id = new ObjectId(req.body.id);


  MongoClient.connect(url, function (err, client) {
    var dbo = client.db("portal");

    dbo.collection("librarian").updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          is_deleted:true
        },
      }
    );
  });

  
});



//delete book from api not from database
app.post("/delete_book", function (req, res) {
  
  var o_id = new ObjectId(req.body.id);


  MongoClient.connect(url, function (err, client) {
    var dbo = client.db("portal");

    dbo.collection("books").updateOne(
      {
        _id: o_id,
      },
      {
        $set: {
          is_deleted:true
        },
      }
    );
  });

  
});



//check if the user is librarian
function setUser(req, res, next) {
  const userName = req.body.name
  if (userName) {
    req.user = users.find(user => user.name === userName)
  }
  next()
}


const port =  4000;
app.listen(port, () => console.log("listening to port 4000"));