import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
var path = require('path');

import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config';
import passport from 'passport'
import Admin from './models/adminModel'

let app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

app.use(passport.initialize({ session: false }))

var allowedOrigins = [];

if (process.env.NODE_ENV == 'prod') {
	allowedOrigins = ['https://magazin.einfachiota.de', 'https://www.einfachiota.de'];
} else {
	allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'https://magazin.einfachiota.de', 'http://localhost:9080', 'https://www.einfachiota.de'];
}

console.log("allowedOrigins");
console.log(allowedOrigins);
app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin 
		// (like mobile apps or curl requests)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) === -1) {
			var msg = 'The CORS policy for this site does not ' +
				'allow access from the specified Origin.';
			return callback(new Error(msg), false);
		}
		return callback(null, true);
	}
}));

const jwtOptions = {
	secretOrKey: config.jwtSecret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
}

passport.serializeUser(function(user, done) {
  done(null, user.username);
})

passport.deserializeUser(function(username, done) {
	Admin.findOne({ username: username })
	.then((user) => {
		return done(user)
	})
	.catch(done)
})

passport.use('jwt', new JwtStrategy(jwtOptions, (jwt_payload, done) => {
	Admin.findOne({ username: jwt_payload.id })
	.then(user => {
		if(user) return done(null, user)
		else return done(null, false)
	})
}))

// connect to db
initializeDb( db => {

	// internal middleware
	app.use(middleware({ config, db })); 
	
	app.use('/', express.static(__dirname + './frontend/dist'));
	app.get('/', function (req, res) {
		res.sendFile(path.join(__dirname + './frontend/dist/index.html'));
	});
	// api router
	app.use('/api', api({ config, db }));


	app.listen(process.env.PORT || config.port);

	console.log(`Started on port ${process.env.PORT}`);
});

export default app;
