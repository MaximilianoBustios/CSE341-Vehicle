/*const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require ('./data/database');
const app = express();

const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3000;

app
    .use(bodyParser.json())
    .use(session({
        secret: "secret",
        resave: false ,
        saveUninitialized: true ,
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept,Z-Key, Authorization"
        );
        res.setHeader(
            "Access-Control-Allow-Methods",
            "POST, GET, PUT, PATCH, OPTIONS, DELETE"
        );
        next();
    })
    .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']}))
    .use(cors({ origin: "*"}))
    .use("/", require("./routes/index.js"))

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done){
        return done(null, profile);
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/', (req, res) => { res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")});

app.get('/github/callback', passport.authenticate('github',{
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node running on port ${port}`)});
    }
});
*/

const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware configuration
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

// CORS configuration (combined into one call)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
}));

// Custom headers for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, PATCH, OPTIONS, DELETE');
    next();
});

// Passport initialization and session configuration
app.use(passport.initialize());
app.use(passport.session());

// Set up passport GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/', require('./routes/index.js'));

// Home route
app.get('/', (req, res) => {
    const message = req.session.user ? `Logged in as ${req.session.user.displayName}` : 'Logged Out';
    res.send(message);
});

// GitHub callback route
app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs', session: false }), (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

// Initialize database and start the server
mongodb.initDb((err) => {
    if (err) {
        console.error('Database initialization error:', err);
    } else {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
});

