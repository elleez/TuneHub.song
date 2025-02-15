const rootUrl= 'https://accounts.google./o/oauth2/v2/outh'
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4555;

const isProduction = process.env.NODE_ENV === 'production';
const callbackURL = isProduction
  ? 'https://elleez.github.io/TuneHub/'  // Correct production URL
  : 'http://localhost:4555/auth/google/callback';  // Local development URL

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: callbackURL
}, (accessToken, refreshToken, profile, done) => {
  const user = {
    id: profile.id,
    displayName: profile.displayName || "No Name",
    email: profile.emails?.[0]?.value || "No Email"
  };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/mtv.html');
  } else {
    res.redirect('/auth/google');
  }
});

app.get('/mtv.html', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mtv.html'));
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/mtv.html');
  }
);

app.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/index.html');
    });
  });
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(4555, '0.0.0.0');
