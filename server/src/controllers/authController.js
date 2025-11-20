const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
} = require("../helper/cookie");

// 🟩 Handle User Login
const handleLogin = async (req, res, next) => {
  try {
    const existingAccessToken = req.cookies.accessToken;
    if (existingAccessToken) {
      try {
        jwt.verify(existingAccessToken, jwtAccessKey);
        return res.status(400).json({ message: "User already logged in" });
      } catch (err) {
        console.error(err);
      }
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(404)
        .json({ message: "User not found. Please register first." });

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: "Email/password did not match" });

    if (user.isBanned)
      return res
        .status(403)
        .json({ message: "You are banned. Please contact support." });

    const accessToken = createJSONWebToken(
      { _id: user._id, email: user.email },
      jwtAccessKey,
      "1y" // 🕒 suggested short expiry
    );
    setAccessTokenCookie(res, accessToken);

    const refreshToken = createJSONWebToken(
      { _id: user._id, email: user.email },
      jwtRefreshKey,
      "1y" // 🕒 longer expiry
    );
    setRefreshTokenCookie(res, refreshToken);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      payload: { userWithoutPassword, token: accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 Handle Logout
const handleLogout = async (req, res, next) => {
  try {
    clearAuthCookies(res);
    return successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 Handle Refresh Token
const handleRefreshToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    const payload = {
      _id: decodedToken._id,
      email: decodedToken.email,
    };

    const accessToken = createJSONWebToken(payload, jwtAccessKey, "1y");
    setAccessTokenCookie(res, accessToken);

    return successResponse(res, {
      statusCode: 200,
      message: "New access token is generated",
      payload: {},
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🟩 Protected Route Example
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return res.status(401).json({ message: "Access token missing" });

    const decodedToken = jwt.verify(accessToken, jwtAccessKey);
    if (!decodedToken)
      return res
        .status(401)
        .json({ message: "Invalid access token. Please login again." });

    return res.status(200).json({
      success: true,
      message: "Protected resources accessed successfully",
      payload: {
        user: {
          _id: decodedToken._id,
          email: decodedToken.email,
        },
      },
    });
  } catch (error) {
    console.error("Protected route error:", error);
    next(error);
  }
};

// 🟩 Google OAuth
const handleGoogleOAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) throw new Error("Google access token is required");

    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { sub, name, email, picture } = googleUser;
    if (!email) throw new Error("Google account does not have a public email");

    let user = await User.findOne({ email });
    if (!user) {
      user = await new User({
        name: name || "Google User",
        email,
        password: null,
        isGoogleLogin: true,
        googleId: sub,
        image: picture || "default.jpg",
      }).save();
    }

    const accessToken = createJSONWebToken(
      { _id: user._id, email: user.email },
      jwtAccessKey,
      "1y"
    );
    const refreshToken = createJSONWebToken(
      { _id: user._id, email: user.email },
      jwtRefreshKey,
      "1y"
    );

    setAccessTokenCookie(res, accessToken);
    setRefreshTokenCookie(res, refreshToken);

    return res.json({
      success: true,
      message: "User verified successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
  handleGoogleOAuth,
};
