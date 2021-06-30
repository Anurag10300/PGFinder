
require('dotenv').config();

const express = require("express");
const ejs = require('ejs');

const app  = express();

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
  


app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));



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
app.get('/', (req, res) => {
   res.render('pages/index');
    

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

app.post('/newPG', function(req,res){
    return res.redirect('/');
})

app.get('/login/callback' , requiresAuth(), function(req,res){
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


app.listen(3000,function(){
    console.log("Active at 3000");
});
