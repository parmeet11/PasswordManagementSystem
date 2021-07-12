const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Password Management System' });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Password Management System' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Password Management System' });
});

router.get('/passwordCategory', function(req, res, next) {
  res.render('pwd_category', { title: 'Password Management System' });
});

module.exports = router;
