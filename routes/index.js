var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passwordModule = require('../modules/add_password');
var bodyParser = require("body-parser");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//const { check, validationResult } = require('express-validator');

var getpassword = passwordModule.find({});

function checkloginuser(req, res, next){
  var usertoken = localStorage.getItem('usertoken');
  try {
    var decoded = jwt.verify(usertoken, 'logintoken');
  } catch(err) {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



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
  var loginuser = localStorage.getItem('loginuser');
  if(loginuser){
    res.redirect('/dashboard');
  }else{
  res.render('index', { title: 'Password Management System', msg:"" });
  }
});

router.post('/', function(req, res, next) {
   var username = req.body.username;
   var password = req.body.password;
   var checkuser = userModule.findOne({username: username});
   checkuser.exec((err, data)=>{
      if(err) throw err;
      
      var getid = data._id;
      var getpassword = data.password;
      if(bcrypt.compareSync(password, getpassword)){
        var token = jwt.sign({ userid: 'getid' }, 'logintoken');
        localStorage.setItem('usertoken', token);
        localStorage.setItem('loginuser', username);
        //console.log(localStorage.getItem('usertoken'));
        res.redirect('/dashboard');
      } 
      else{
        res.render('index', { title: 'Password Management System', msg:"Invalid Username or password" });
      }
   });
});

router.get('/dashboard', checkloginuser, function(req, res, next) {
  var loginuser = localStorage.getItem('loginuser');
  res.render('dashboard', { title: 'Password Management System', loginuser:loginuser});
});

router.get('/signup', function(req, res, next) {
  var loginuser = localStorage.getItem('loginuser');
  if(loginuser){
    res.redirect('/dashboard');
  }else{
  res.render('signup', { title: 'Password Management System', msg:''});
  }
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

router.get('/passwordCategory',checkloginuser, function(req, res, next) {
  res.render('pwd_category', { title: 'Password Management System' });
});

router.get('/addPassword', checkloginuser,function(req, res, next) {
  var loginuser = localStorage.getItem('loginuser');
  getpassword.exec(function(err,data){
    if(err) throw err;
    res.render('add_password', { title: 'Password Management System', loginuser:loginuser, /*errors:'', records:data,*/msg:''});
  })  
  
});

router.post('/addPassword',checkloginuser,/*[check('pass_details','Enter password details').isLength({min:1})]*/function(req, res, next) {
  var loginuser = localStorage.getItem('loginuser');
  var category_name = req.body.category_name;
  var pass_details = req.body.pass_details;
  if(pass_details==''){
    res.render('add_password', { title: 'Password Management System', loginuser:loginuser,/* errors:'', records:data,*/ msg:'enter password details'});
  }
  else{
  var password_details = new passwordModule({
    "category_name": category_name,
    "password_detail": pass_details
  });

  /*const errors = validationResult(req);
  if(!errors.isEmpty()){
    //console.log(errors.mapped());
    res.render('add_password', { title: 'Password Management System', loginuser:loginuser, errors: errors.mapped()});
  }else{
  res.render('add_password', { title: 'Password Management System', loginuser:loginuser, errors:'' });
  }*/

  password_details.save(function(err,doc){
    
      if(err) throw err;
      res.render('add_password', { title: 'Password Management System', loginuser:loginuser,/* errors:'', records:data,*/ msg:'password details inserted successfully'});
    
  })
}
});

router.get('/logout', function(req, res, next) {
  localStorage.removeItem('usertoken');
  localStorage.removeItem('loginuser');
  res.redirect('/');
});

module.exports = router;
