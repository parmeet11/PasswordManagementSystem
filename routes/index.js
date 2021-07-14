var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var bodyParser = require("body-parser");

//router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System', msg:''});
});

router.post('/signup', function(req, res, next) {
  //var details = new userModule({
   var username = req.body.username;
   var email = req.body.email;
   var password = req.body.password;
   var cpassword = req.body.cpassword;
 
   var details = new userModule({
    "username": username,
    "email": email,
    "password": password
  });
  details.save((err,doc)=>{
    if(err)  console.log(err);
    res.render('signup', { title: 'Password Management System', msg:'user registered successfully' });
  })
  //console.log(details);
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('pwd_category', { title: 'Password Management System' });
});

module.exports = router;
