// POST method route
// http://localhost:8585/Search?type=<builder/advenced>&mainCategory=<the main category with hashtag>&Category=<the second category with hashtag>&subCategory=<the last category with hashtag>
// http://localhost:8585/Search?type=builder&mainCategory=Fintech&Category=StockExchange&subCategory=Forex

const express = require('express');
const app = express();
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

var MongoClient = require('mongodb').MongoClient;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
const ip = require("ip");
const { json } = require('body-parser');
const port = 51300;
app.listen(port, ip.address(),()=>{
  console.log("NodeJs Server---> Running On:", ip.address() + ":" + port);
});



//SearchKeysUrl
var SEARCH_KEYS_GET = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/SearchKeys?retryWrites=true&w=majority";

//RecentSearch
var SEARCH_POST = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/Searchs?retryWrites=true&w=majority";

//UsersUrl
var USER_GET = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/Users?retryWrites=true&w=majority";
var USER_POST = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/Users?retryWrites=true&w=majority";

//UserSavedListsUrl
var USER_SAVED_LISTS_GET = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/Users?retryWrites=true&w=majority";
var USER_SAVED_LISTS_POST = "mongodb+srv://RonRamal:ron123456@global.0jqdg.mongodb.net/Users?retryWrites=true&w=majority";


///////////////////////////////////////////////////////////////////////////
//SearchKeys - Methods
///////////////////////////////////////////////////////////////////////////
// GET method route
app.get('/SearchKeys', (req, res) => {
    MongoClient.connect(SEARCH_KEYS_GET, { useUnifiedTopology: true},function(err, db) {
        if (err) throw err;
        console.log("SearchKeys");
        console.log(req.query.collectionName);
        var dbo = db.db("SearchKeys");        
        dbo.collection(req.query.collectionName).find({}).toArray(function(err, result) {
            if (err) throw err; 
            console.log(result);
            db.close();
            res.send(JSON.stringify(result));
        });
        
    }); 
})
//////////////////////////////////////////////

//Search - Methods
///////////////////////////////////////////////////////////////////////////
app.post('/Users/RecentSearch', function (req, res) {
  MongoClient.connect(USER_SAVED_LISTS_POST, { useUnifiedTopology: true}, function(err, db) {
      if (err) throw err;
     var dbo = db.db("Users");

     let aUserFilter={
      mEmail:req.body.email,
     }
      console.log("RecentSearch-- aUserFilter->" +JSON.stringify(aUserFilter));     
      dbo.collection("UsersCollection").findOneAndUpdate(aUserFilter,
      { $push: { UserSearchKeys: req.body.SearchData }},
      { upsert: true },function(err, result) {
              if (err) throw err; 
              console.log("RecentSearch- updateOne->" +JSON.stringify(result));
              db.close(); 
              res.send(JSON.stringify(result));      
       });             
    }); 
})
//___________________________________________________________________
// GET USER Recent 
app.get('/Users/RecentSearch', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      console.log("USER RecentSearch - GET Called");

      let aLoginDetails;
      if(req.query.email){
         aLoginDetails={
          mEmail:req.query.email
        }
      }else{
        res.send(false);
      }
      dbo.collection("UsersCollection").findOne({mEmail:req.query.email},function(err, result) {
          if (err) throw err; 
          db.close();    

          if(result.UserSearchKeys){
            console.log("RecentSearch" +JSON.stringify(result.UserSearchKeys));
            res.send(JSON.stringify(result.UserSearchKeys));         
          }else{
            return false;
          }
         
      });
  }); 
})

//___________________________________________________________________
app.post('/Global/RecentSearch', function (req, res) {
  MongoClient.connect(USER_SAVED_LISTS_POST, { useUnifiedTopology: true}, function(err, db) {
      if (err) throw err;
     var dbo = db.db("Searchs");
      let aSearchObject = { mFirstCategry:req.body.firstCat, mSecondCategry:req.body.secondCat,mThirdCategoy:req.body.thirdCat};

      dbo.collection("Searchs").insertOne(aSearchObject, function(err, result) {
        if (err) throw err;
        console.log("Global/RecentSearch Post - " + result);
        db.close();
        res.send(JSON.stringify(result))
      });
    }); 
})

  
///////////////////////////////////////////////////////////////////////////
//User - Methods
///////////////////////////////////////////////////////////////////////////

// SignUp Method -POST-
app.post('/Users/SignUp', function (req, res) {
  MongoClient.connect(USER_POST, { useUnifiedTopology: true}, function(err, db) {
      if (err) throw err;
      console.log("Users-Post");

      var dbo = db.db("Users");
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.Password, salt, function(err, hash) {
            // Store hash in your password DB.
            var aUserObject = { mFirstName:req.body.FirstName, mLastName:req.body.LastName,mUserName:req.body.UserName,mEmail:req.body.Email,mPassword:hash};
            dbo.collection("UsersCollection").insertOne(aUserObject, function(err, result) {
              if (err) throw err;
              console.log("Users Post - " + result);
              db.close();
              res.send(JSON.stringify(result))
            });
        });
      });
    }); 
})

//////////////////////////////////////////////
// Login Method -GET-
app.get('/Users/Login', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      console.log(req.query);
      console.log("LOGIN-GET - EMAIL:"+req.query.email+",PASSWORD:"+req.query.password);

      let aLoginDetails;
      if(req.query.email){
         aLoginDetails={
          mEmail:req.query.email
        }
      }else if(req.query.username){
         aLoginDetails={
          mUserName:req.query.username
        }
      }
     
      dbo.collection("UsersCollection").findOne(aLoginDetails,function(err, result) {
          if (err) throw err; 
          console.log(result);
          db.close();
         if(result){
          bcrypt.compare(req.query.password,result.mPassword,function(err,bcryptRes){
            console.log("bcrypt Compare Result: " + bcryptRes);
            res.send(JSON.stringify(result));
          });
         } else{
          res.send(false);
         }
       
      });
  }); 
})
//////////////////////////////////////////////
// PUT Method -GET-
app.put('/Users/Update', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      let aUserOldDetails={
        mEmail:req.body.Email
      }
      let aUserNewDetails = { mFirstName:req.body.FirstName, mLastName:req.body.LastName,mUserName:req.body.UserName};
      console.log("Update-- aUserOldDetails->" +JSON.stringify(aUserOldDetails));

      dbo.collection("UsersCollection").findOne(aUserOldDetails,function(err, FindOneResult) {
          if (err) throw err; 
          console.log("Update-- findOne->" +JSON.stringify(FindOneResult));
          let newvalues = {
            $set: aUserNewDetails
         }
          dbo.collection("UsersCollection").updateOne(FindOneResult,newvalues,function(err, result) {
            if (err) throw err; 
            console.log("Update-- updateOne->" +JSON.stringify(result));
            db.close(); 
            res.send(JSON.stringify(result));      
        });
                
      });
     
  }); 
})

//////////////////////////////////////////////
// GET All Users
app.get('/Users', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
        var dbo = db.db("Users");
        
        dbo.collection("UsersCollection").find({}).toArray(function(err, result) {
            if (err) throw err; 
            console.log(result);
            db.close();
            res.send(JSON.stringify(result));
        });
    }); 
})

///////////////////////////////////////////////////
// Check if user exists
app.get('/Users/Exist', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      console.log("Users-EXIST");

      let aLoginDetails;
      if(req.query.email){
         aLoginDetails={
          mEmail:req.query.email
        }
      }else{
        res.send(false);
      }
      dbo.collection("UsersCollection").findOne(aLoginDetails,function(err, result) {
          if (err) throw err; 
          console.log("Exist" +JSON.stringify(result));
          db.close();    
          res.send(JSON.stringify(result));         
      });
  }); 
})


///////////////////////////////////////////////////////////////////////////
//USER SAVED LISTS - Methods
///////////////////////////////////////////////////////////////////////////
// Post User Saved Lists
app.post('/Users/Lists', function (req, res) {
  MongoClient.connect(USER_SAVED_LISTS_POST, { useUnifiedTopology: true}, function(err, db) {
      if (err) throw err;
      console.log("User Saved Lists Post Called");
      var dbo = db.db("Users");

      var aUserObject = { mFirstName:req.body.FirstName, mLastName:req.body.LastName,mUserName:req.body.UserName,mEmail:req.body.Email,mPhone:req.body.Phone,mPassword:hash};

      dbo.collection("UserListsCollection").insertOne(aUserObject, function(err, result) {
        if (err) throw err;
        console.log("User Saved Lists Post - " + result);
        db.close();
        res.send(JSON.stringify(result))
      });
    }); 
})

/////////////////////////////////////////////////////
// Get User Saved Lists
app.get('/Users/Lists', (req, res) => {
  MongoClient.connect(USER_SAVED_LISTS_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      console.log("Get User Saved Lists");

      let aUserDara;
      if(req.query.email){
        aUserDara={
          mEmail:req.query.email,
        }
      }else{
        res.status(400).end(res);
      }
      dbo.collection("UserListsCollection").find(aUserDara).toArray(function(err, result) {
          if (err) throw err; 
          console.log("Get User Saved Lists - " +JSON.stringify(result));
          db.close();    
          res.send(JSON.stringify(result));         
      });
  }); 
})
///////////////////////////////////////////////////////////////////////////
//USER FAVORITE INFLUENCERS - METHODS
///////////////////////////////////////////////////////////////////////////
// Post USER FAVORITE USER
app.post('/Users/Favorite', function (req, res) {
  MongoClient.connect(USER_SAVED_LISTS_POST, { useUnifiedTopology: true}, function(err, db) {
      if (err) throw err;
     var dbo = db.db("Users");

     let aUserFilter={
      mEmail:req.body.email,
     }
      console.log("Favorite-- aUserFilter->" +JSON.stringify(aUserFilter));     
      dbo.collection("UsersCollection").findOneAndUpdate(aUserFilter,
      { $push: { SavedUsers: req.body.profileData }},
      { upsert: true },function(err, result) {
              if (err) throw err; 
              console.log("Update-- updateOne->" +JSON.stringify(result));
              db.close(); 
              res.send(JSON.stringify(result));      
       });             
    }); 
})
///////////////////////////////////////////////////
// GET USER FAVORITE USERS
app.get('/Users/Favorite', (req, res) => {
  MongoClient.connect(USER_GET, { useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
      var dbo = db.db("Users");
      console.log("USER FAVORITE USERS - GET Called");

      let aLoginDetails;
      if(req.query.email){
         aLoginDetails={
          mEmail:req.query.email
        }
      }else{
        res.send(false);
      }
      dbo.collection("UsersCollection").findOne({mEmail:req.query.email},function(err, result) {
          if (err) throw err; 
          if(result.SavedUsers){
            console.log("Exist" +JSON.stringify(result.SavedUsers));
            db.close();    
            res.send(JSON.stringify(result.SavedUsers));  
          }else{
            db.close();    
            res.send(false);  
          }
               
      });
  }); 
})