/** 
 * Module dependencies. 
 */  
   
//加载模块  
var util = require('util');  
var http = require('http');  
var path = require('path');  
var routes = require('./routes');  
var express = require('express');  
   
//添加插件模块  
var MongoStore = require('connect-mongodb');  
var dbConfigure = require('./db_configure').configure;  
var partials = require('express-partials');  
var flash = require('connect-flash');  
   
//定义app  
var app = express();  
   
var sessionStore = new MongoStore({  
    db: dbConfigure.db  
}, function () {  
    console.log('connect mongodb success...');  
});  
   
// 文件配置 all environments  
app.configure(function () {  
   
    app.set('port', process.env.PORT || 3000);  
    app.set('views', __dirname + '/views');  
    app.set('view engine', 'jade');  
   
    app.use(partials());  
    app.use(flash());  
    app.use(express.favicon());  
    app.use(express.logger('dev'));  
    app.use(express.bodyParser());  
    app.use(express.methodOverride());  
   
    app.use(express.cookieParser());  
    app.use(express.cookieSession({  
        secret: dbConfigure.cookieSecret,  
        cookie: {  
            maxAge: 60000 * 30 //20 minutes  
        },  
        store: sessionStore  
    }));  
    app.use(app.router);  
    app.use(express.static(__dirname + '/public'));  
});  
   
//添加路由  
// routes(app);  
---------------- routes/index.js --------------  
module.exports = function (app) {  
    app.get('/query', function (req, res) {  
   
    });  
};  
--------------------------------------------  
app.get('/', routes.index);  
app.get('/reg', routes.reg);  
app.post('/reg', routes.doReg);  
app.get('/login', routes.login);  
app.post('/login', routes.doLogin);  
app.get('/logout', routes.logout);  
   
   
// development only  
if ('development' == app.get('env')) {  
    app.use(express.errorHandler());  
}  
   
//启动服务  
http.createServer(app).listen(app.get('port'), function () {  
    console.log('服务器已启动，监听：' + app.get('port'));  
});  
   
//输出日志  
console.log(util.inspect([new MongoStore({  
    db: dbConfigure.db_name  
})], true, 4, true));  