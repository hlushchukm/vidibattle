const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const passport = require("passport");
const { User } = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENT_ID ?? "",
      clientSecret: process.env.GG_CLIENT_SECRET ?? "",
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const user = {
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails?.[0]?.value,
        profile_img: profile.photos[0]?.value,
        provider: "google",
        profile_id: profile.id,
      };

      const existingUser = await User.findOne({
        profile_id: user.profile_id,
        provider: "google",
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User(user);

      try {
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID ?? "",
      clientSecret: process.env.FB_CLIENT_SECRET ?? "",
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "name", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = {
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails?.[0]?.value,
        profile_img: profile.photos[0]?.value,
        provider: "facebook",
        profile_id: profile.id,
      };

      const existingUser = await User.findOne({
        profile_id: user.profile_id,
        provider: "facebook",
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const newUser = new User(user);

      try {
        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Instagram OAuth
passport.use(
  new InstagramStrategy(
    {
      clientID: process.env.IG_CLIENT_ID ?? "",
      clientSecret: process.env.IG_CLIENT_SECRET ?? "",
      callbackURL: "/api/auth/instagram/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("instagram");
      console.log(profile);
      done(null, profile);
      // Handle user authentication or registration
      // Access user profile data via the `profile` object
      // Call `done()` when finished
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
