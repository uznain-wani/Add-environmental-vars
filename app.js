
require ("dotenv").config();                   //keep this on top always for requiring .env file
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt =require("mongoose-encryption");

const app = express();
//console.log(process.env.SECRET);   //for acessing our secret in .env file

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/usersDB");
const userSchema = new mongoose.Schema( {   //for using mongoose encryption we changed sytax in schema and added new mongoose.Schema
  email: String,
  password: String
});
///////////for encrypting password in binary data  syntax is////////////////////
//environment variables or .env are files that keep certainn sensitive variables  such as encryption keys and api keys  to keep them safe and secure off the internet///
//for this run "npm i dotenv" in CMD//
//const secret ="This is little secret.";  we will keep our thus secret in .env file for keeping it secure and safe
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/",function(req,res){
    res.render("home")
});
app.get("/login",function(req,res){
    res.render("login")
});
app.get("/register",function(req,res){
    res.render("register")
});
app.post("/register",function(req,res){
   // add a new user to our dbase
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
       });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");  // if they register then only take them to secrets page 
        }
    });
});
app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
   // check if he is registered user from our db  then log him in secrets page

    User.findOne({email:username},function(err,founduser){ // check if typed username matches  our dbase email
        if(err){
            console.log(err);
        }else{
            if(founduser.password===password){  //then also check its password with our db password and give him acess to secrets page
                res.render("secrets");
            }
        }
    });
});
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });