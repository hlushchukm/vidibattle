const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const InstagramStrategy = require("passport-instagram").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { Admin } = require("../models/admin.model");
const { storeProfile } = require("../controllers/media.controller");
const { createWallet } = require("../controllers/wallet.controller");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_CLIENT_ID ?? "",
      clientSecret: process.env.GG_CLIENT_SECRET ?? "",
      callbackURL: "/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const user = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email,
          username: email ? email.split("@")[0]?.replaceAll(".", "_") : null,
          profile_img: profile.photos[0]?.value,
          provider: "google",
          profile_id: profile.id,
        };

        const existingUser = await User.findOne({
          profile_id: user.profile_id,
          provider: "google",
        });

        if (existingUser) {
          if (existingUser.status === "deleted") {
            return done(null, false);
          }
          return done(null, existingUser);
        }

        // make a copy of the profile image and store it on db
        const profileImg = await storeProfile(user.profile_img);
        user.profile_img = profileImg;
        const newUser = new User(user);

        await newUser.save();

        // create wallet
        await createWallet(newUser._id);

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
      try {
        const email = profile.emails?.[0]?.value;
        const user = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email,
          username: email ? email.split("@")[0]?.replaceAll(".", "_") : null,
          profile_img: profile.photos[0]?.value,
          provider: "facebook",
          profile_id: profile.id,
        };

        const existingUser = await User.findOne({
          profile_id: user.profile_id,
          provider: "facebook",
        });

        if (existingUser) {
          if (existingUser.status === "deleted") {
            return done(null, false);
          }
          return done(null, existingUser);
        }

        // make a copy of the profile image and store it on db
        const profileImg = await storeProfile(user.profile_img);
        user.profile_img = profileImg;
        const newUser = new User(user);

        await newUser.save();

        // create wallet
        await createWallet(newUser._id);

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

passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Specify the field name for the email
    },
    async (email, password, done) => {
      try {
        // Find the user by email
        const admin = await Admin.findOne({ email });

        if (!admin) {
          return done(null, false, "Incorrect email or password");
        }

        // If user not found or password doesn't match, return error
        if (!(await bcrypt.compare(password, admin.password))) {
          return done(null, false, "Incorrect email or password");
        }

        // Authentication successful
        return done(null, admin);
      } catch (e) {
        return done(e);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
