const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");

const { clientId, clientSecret, callbackURL } = require("../secret");

passport.use(
  new GoogleStrategy(
    {
      clientID: clientId, // ঠিক আছে, capital D থাকা উচিত
      clientSecret: clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // গুগল থেকে পাওয়া email দিয়ে ইউজার খুঁজে পাওয়া
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingUser) {
          // ইউজার আছে, সেটাকে ফিরিয়ে দাও
          return done(null, existingUser);
        }

        // নতুন ইউজার তৈরি
        const newUser = new User({
          name: profile.displayName || "Google User",
          email: profile.emails[0].value,
          password: null, // পাসওয়ার্ড নেই, কারণ গুগল লগিন
          isVerified: true, // গুগল ইউজার তাই সরাসরি ভেরিফায়েড
          isGoogleUser: true,
          googleId: profile.id, // গুগল আইডি রাখা ভালো পরে ইউজার চেক করার জন্য
          image: profile.photos?.[0]?.value || null, // গুগল প্রোফাইল ছবি রাখা
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// session ব্যবহার করলে serialize/deserialize দরকার, না হলে বাদ দিতে পারো
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
