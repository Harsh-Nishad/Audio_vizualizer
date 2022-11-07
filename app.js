var express = require("express");
var bodyParser = require("body-parser");

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://deswal:harsh@cluster0.r2hks.mongodb.net/test');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://deswal:harsh@cluster0.r2hks.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

var app = express()


app.use(bodyParser.json());
app.use(express.static('public/'));
app.use(bodyParser.urlencoded({
    extended: true
}));






app.post('/sign_up', function (req, res) {

    var email = req.body.email;
    var pass = req.body.password;
    var confpass = req.body.confirmPassword;

    if (pass != confpass)
        alert("Passwords are not matching");
    var data = {

        "email": email,
        "password": pass,
        "ConfmPassword": confpass
    }
    db.collection('details').insertOne(data, function (err, collection) {
        if (err) throw err;
        console.log("Record inserted Successfully");


    });

    return res.redirect('login.html');
})
app.get('/login', (req, res, next) => {
    return res.render('login.html');
});

app.post('/login', (req, res, next) => {
    console.log('hello');
    var email = req.body.email;
    var password = req.body.password;
    if (!email || !password) {
        return req.redirect('login.html');
    }
    db.collection('details').findOne({ email }, (err, user) => {
        if (user) {

            if (user.password == req.body.password) {

                return res.redirect("after_login.html");
            } else {
                res.send({ "Success": "Wrong password!" });
            }
        } else {
            res.send({ "Success": "This Email Is not regestered!" });
        }
    });

});


app.get('/', function (req, res) {
    res.set({
        'Access-control-Allow-Origin': '*'
    });
    return res.redirect('demo.html');
}).listen(3000)


console.log("server listening at port 3000");