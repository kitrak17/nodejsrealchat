var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});*/

router.get('/', function(req, res){
  res.sendfile('views/name.html');
});

router.get('/room1', function(req, res){
  res.sendfile('views/room1.html');
});
router.get('/room2', function(req, res){
  res.sendfile('views/room2.html');
});

module.exports = router;
