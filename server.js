
require('dotenv').config();
var bodyParser = require('body-parser');


const connectDB = require("./DB/connection");
const User =  require("./DB/user"); 

const express = require("express");
const ejs = require('ejs');

const app  = express();
const fs = require("fs");

const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_URL
  };
  
connectDB();

app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));

//app.use('/newPG', require('./api/user.js'));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/newPG' , async function(req,res){
  
  var user = new User();

  user.ownerName = req.body.owner;
  user.ownerNumber =req.body.pNumber;
  user.address1 = req.body.address1;
  user.address2 = req.body.address2;
  user.rooms = req.body.rooms;
  user.kitchen = req.body.kitchen;
  user.mess = req.body.mess;
  user.rent = req.body.rent;
  user.description = req.body.description;


  user.save(function(err) {
    if (err) return next(err);
  });

  return res.redirect('/');



});




// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


app.get("/signup", (req, res) => {
  res.oidc.login({
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});


// req.isAuthenticated is provided from the auth router
//app.get('/', (req, res) => {
 //  res.render('pages/index');
    

//});

app.get("/", requiresAuth(), function (req, res) {   
  User.find(function (err, data) {
      if (err) {
          console.log(err);
      } else {
          res.render('pages/index',{Usert:data});
      }
  });
  });

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


// the ADD PG button redirects to new page
app.post('/', function(req,res){
    return res.redirect('/newPG');
});


//for newPG page
app.get('/newPG',requiresAuth(), function(req,res){
    res.render('pages/newPG.ejs');
});


app.get('/login/callback/' , requiresAuth(), function(req,res){
    return res.redirect('/');
});


app.get('/login/callback/' , requiresAuth(), function(req,res){
  return res.redirect('/');
});

app.get('/callback/' , requiresAuth(), function(req,res){
  return res.redirect('/');
});

app.get('/callback' , requiresAuth(), function(req,res){
  return res.redirect('/');
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.render("profile", {
    user: req.oidc.user,
  });
});

app.get('/authHome', requiresAuth(), function(req,res){
    res.render('pages/indexAuthorised');
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Active at 3000");
});
