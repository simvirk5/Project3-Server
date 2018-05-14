
require('dotenv').config();
var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var expressJWT = require('express-jwt');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var app = express();
mongoose.Promise = global.Promise;

// Mongoose connect
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/mernauth', {useMongoClient: true});

// Set up middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.resolve(__dirname, 'client', 'build')));


// Controllers

app.use('/profile', require('./routes/profile'));
app.use('/student', require('./routes/student'));
app.use('/mentor', require('./routes/mentor'));
app.use('/', require('./routes/search'));
app.use('/auth', expressJWT({ 
	secret: process.env.JWT_SECRET,
	getToken: function fromRequest(req) {
		if(req.body.headers.Authorization && req.body.headers.Authorization.split(' ')[0] === 'Bearer') {
			return req.body.headers.Authorization.split(' ')[1];
		}
		return null;
	}
}).unless({
	path: [
	{ url: '/auth/login', methods: ['POST'] },
	{ url: '/auth/signup', methods: ['POST'] }
	]
}),require('./routes/auth'));

app.get('*', function(req, res, next) {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.listen(process.env.PORT || 3001);
