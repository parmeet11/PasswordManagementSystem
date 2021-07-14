var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');

//email check middleware
function checkemail(req,res,next){
  var email = req.body.email;
  var existemail = userModule.findOne({email:email});
  existemail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      res.render('signup', { title: 'Password Management System', msg:'email already exist'});
    }
    next();
  });
}

//username check middleware
function checkusername(req,res,next){
  var uname = req.body.username;
  var existusername = userModule.findOne({username: uname});
  existusername.exec((err,data)=>{
    if(err) throw err;
    if(data){
      res.render('signup', { title: 'Password Management System', msg:'username already exist'});
    }
    next();
  });
}

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

router.post('/signup', checkemail, checkusername, function(req, res, next) {
  //var details = new userModule({
   var username = req.body.username;
   var email = req.body.email;
   var password = req.body.password;
   var cpassword = req.body.cpassword;
   if(password != cpassword){
    res.render('signup', { title: 'Password Management System', msg:'Password not matched' });
   }
   else{
      password= bcrypt.hashSync(req.body.password,10);
      var details = new userModule({
        "username": username,
        "email": email,
        "password": password
      });
      details.save((err,doc)=>{
        if(err)  console.log(err);
        res.render('signup', { title: 'Password Management System', msg:'user registered successfully' });
      })
    }
  //console.log(details);
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('pwd_category', { title: 'Password Management System' });
});

module.exports = router;
