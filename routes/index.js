var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.render('index', { title: 'Express' });
	var path =__dirname;
	path=path.substr(0,path.length-6);
	console.log(path);
	res.sendFile(path+"/index.html");
});

module.exports = router;