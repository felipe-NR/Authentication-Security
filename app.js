//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//DATA BASE
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);

app.route("/register")

.get(function (req, res) {
    res.render("register");
})

.post(function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(function (err) {
        if(!err) {
            res.render("secrets");
        } else {console.log(err);}
    });

});

app.route("/login")

.get(function (req, res) {
    res.render("login");
})

.post(function (req, res) {
    const username = req.body.username
    const password = md5(req.body.password)

    User.findOne({email: username}, function (err, foundUser) {
        if(!err) {
            if(foundUser) {
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        } else {console.log(err);}
    })
});








app.get("/", function (req, res) {
    res.render("home");
});














app.listen(3000, function() {
    console.log("Server is Up and Running");
});