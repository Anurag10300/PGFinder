
require('dotenv').config();
var bodyParser = require('body-parser');



const connectDB = require("./DB/connection");
const User =  require("./DB/user"); 
const imgModel = require("./DB/image");
var fs = require('fs');
var path = require('path');

const express = require("express");
const ejs = require('ejs');

const app  = express();


const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-openid-connect');

var objectId = require('mongodb').ObjectID;

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_URL,
    
  };
  
connectDB();

app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));

//app.use('/newPG', require('./api/user.js'));
app.use(bodyParser.urlencoded({ extended: false }));

var multer = require('multer');
  
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
  
var upload = multer({ storage: storage });

let nickName1;
let idd;
let imageId;

app.post('/newPG' ,  async function(req,res){

  
  
  
  var user = new User();

  user.nickName = nickName1;
  user.pgName = req.body.pgName;
  user.ownerName = req.body.owner;
  user.ownerNumber =req.body.pNumber;
  user.address = req.body.address;
  user.rooms = req.body.rooms;
  user.kitchen = req.body.kitchen;
  user.mess = req.body.mess;
  user.rent = req.body.rent;
  user.description = req.body.description;
  


  user.save(function(err) {
    if (err) return next(err);
  });

 let data =  await User.findOne({pgName:req.body.pgName});
 var id1 = data._id;
 
 console.log(id1);

 //return res.redirect('/home');

  return res.redirect('/image/'+id1);



});

app.get('/image/:id' , (req,res) =>{
    //var id1 = req.params.id;
    imageId = req.params.id;
    
    res.render('pages/image',{id:imageId});
});

app.post('/image/:id' , upload.single('image'), (req, res, next) => {

  
  
  var obj = {
      id : req.params.id,
      img: {
          data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
          contentType: 'image/png'
      }
  }
  imgModel.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          // item.save();
          res.redirect('/home');
      }
  });
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

app.get("/home", requiresAuth(), async function (req, res) {  
  
  let imgdata = await imgModel.find();
  let data = await User.find();
  
  res.render('pages/Findpg',{Usert:data , nick : req.oidc.user.nickname , items : imgdata });


 // User.find(function (err, data) {
 //     if (err) {
  //        console.log(err);
  //    } else {
   //       res.render('pages/Findpg',{Usert:data , nick : req.oidc.user.nickname , });
   //   }
 // });



  nickName1 = req.oidc.user.nickname;
  
  });















app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


app.get('/searchFilter', function(req,res){
    res.render('pages/searchFilter');
});

app.get("/", function(req, res){
  res.render('pages/slideshow');
});

// the ADD PG button redirects to new page
app.post('/home', function(req,res){
    return res.redirect('/newPG');
});

app.get('/search', async (req,res)=>{
    var key = req.query.key;
    
    let data = await User.find(
      {
        "$or":[
          {"pgName":{$regex:key}},
          {"ownerName":{$regex:key}},
          {"address":{$regex:key}},
          
          {"description":{$regex:key}}
          
        ]
      }
    )
    //res.send(data);
    res.render('pages/Findpg',{Usert:data,nick : req.oidc.user.nickname});
    

});

app.post('/searchFilter', function(req,res){
    return res.redirect('/searchResults');
});

app.get("/searchResults" , function(req,res){
  const name = req.query.pgName;
  const address = req.query.address;
  const rooms  = req.query.rooms;
  const kitchen = req.query.kitchen;
  const mess = req.query.mess;
  const rent = req.query.rent;
  //console.log(name,address,rooms,kitchen,mess,rent);

  User.find(function (err, data) {
    if (err) {
        console.log(err);
    } else {
        let nick = req.oidc.user.nickname;
        res.render('pages/SearchResults', {Usert:data,name:name,address:address,rooms:rooms,kitchen:kitchen,mess:mess,rent:rent,nick:nick});
    }
});

  
});

app.post("/", function(req,res){
  return res.redirect('/home');
  
});


//for newPG page
app.get('/newPG',requiresAuth(), function(req,res){
    res.render('pages/newPG.ejs');
    
});


app.get('/login/callback/' , requiresAuth(), function(req,res){
    return res.redirect('/home');
});


app.get('/login/callback/' , requiresAuth(), function(req,res){
  return res.redirect('/home');
});

app.get('/callback/' , requiresAuth(), function(req,res){
  return res.redirect('/home');
});

app.get('/callback' , requiresAuth(), function(req,res){
  return res.redirect('/home');
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

app.get('/find', requiresAuth(), function(req,res){
  res.render('pages/Findpg');
});

app.post('/delete/:id', async (req, res) => {
  await User.deleteOne({_id: req.params.id})
  idd = req.params.id;
  
  return res.redirect('/home')
});

app.post('/expand/:id' , async (req,res) => {

   //data = await User.find({_id : req.params.id});

   let data = await User.findOne( {_id : req.params.id});
   let imgdata = await imgModel.findOne({id : req.params.id});

   

    
    
        res.render('pages/expand', {Usert:data , items:imgdata});
    
   
  
});


app.post('/update/:id',requiresAuth(), function(req,res){

  idd = req.params.id;

  res.render('pages/updateForm.ejs');
  
});

app.post('/updateData', (req,res) =>{


  
  

  User.updateOne({"_id": idd}, {$set:{

    "pgName": req.body.pgName,
    "ownerName": req.body.owner,
    "ownerNumber": req.body.pNumber,
    "address": req.body.address,
    "rooms": req.body.rooms,
    "kitchen": req.body.kitchen,
    "mess": req.body.mess,
    "rent": req.body.rent,
    "description": req.body.description

  }}, function(err, result){ 
    if (err) { 
        console.log('Error updating object: ' + err); 
        res.send({'error':'An error has occurred'}); 
    } else { 
        console.log('' + result + ' document(s) updated'); 
        res.redirect('/home'); 
    } 
}); 

});