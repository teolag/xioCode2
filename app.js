const express = require('express');
const session = require('express-session');
const app = express();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Datastore = require('nedb-promise');
const config = require('./config');
const routes = require('./routes');
const flash = require('connect-flash');

const db = {
    users: new Datastore({ filename: 'database/users', autoload: true })
};

app.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});


app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
app.use(express.static('public'));
app.use(flash());


app.use(passport.initialize());
passport.use(new GoogleStrategy(config.googleOAuth,
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            if(profile.id === config.validGoogleId) {
                db.users.findOne({googleId: profile.id}).then(user => {
                    if(user) {
                        return done(null, user);    
                    } else {
                        //console.log("New user!!", profile);
                        let user = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        };
                        db.users.insert(user).then((newUser) => {
                            return done(null, newUser);
                        });
                    }
                });
            } else {
                return done(null, false, {message: "unknown google user"});
            }
        });
    }
));
passport.serializeUser(function(user, done) {
    //console.log("serialajsa", user);
    done(null, user._id);
});
passport.deserializeUser(function(userId, done) {
    db.users.findOne({_id: userId}).then(user => {
        //console.log("deserialajsa", userId, user);
        done(null, user);
    });
});


app.use(routes);


app.listen(config.port);
console.log("Listening on port " + config.port);
