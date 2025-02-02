var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    app = express(),
	path = require('path'),
	jwt = require('express-jwt'),
	tokenManager = require('./config/token_manager'),
	secret = require('./config/secret');
	
//Routes
var routes = {};
routes.employees = require('./routes/employees.js');
routes.users = require('./routes/users.js');
routes.groups = require('./routes/groups.js');
routes.sessions = require('./routes/sessions.js');

app.use(bodyParser());          // pull information from html in POST
app.use(express.static(path.join(__dirname, '/www')));
app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/employees', jwt({secret: secret.secretToken}), routes.employees.findAll);
app.get('/employees/:id', jwt({secret: secret.secretToken}), routes.employees.findById);
app.get('/groups/:username', jwt({secret: secret.secretToken}), routes.groups.findByUsername);
app.post('/groups', jwt({secret: secret.secretToken}), routes.groups.create);
app.post('/sessions', jwt({secret: secret.secretToken}), routes.sessions.create);
app.get('/sessions/:username', jwt({secret: secret.secretToken}), routes.sessions.findByUsername);
app.get('/users', jwt({secret: secret.secretToken}), routes.users.findAll);

app.post('/register', routes.users.register); 
app.post('/signin', routes.users.signin);
app.get('/logout', routes.users.logout);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});