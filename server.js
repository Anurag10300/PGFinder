const express = require("express");
const ejs = require('ejs');

const app  = express();

app.set('view engine','ejs');

app.use(express.static(__dirname+'/public'));


// for root
app.get('/',function(req,res){
    res.render('pages/index.ejs');
});

// the ADD PG button redirects to new page
app.post('/', function(req,res){
    return res.redirect('/newPG');
});


// for login page
app.get('/login',function(req,res){
    res.render('pages/login.ejs');
});
app.post('/login', function(req,res){
    return res.redirect('/');
});


//for newPG page
app.get('/newPG', function(req,res){
    res.render('pages/newPG.ejs');
});

app.post('/newPG', function(req,res){
    return res.redirect('/');
})



app.listen(3000,function(){
    console.log("Active at 3000");
});
