const createError = require("http-errors");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { uploadSingleBuffer } = require("../config/cloudinary");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAdminAccessKey, jwtAdminRefreshKey } = require("../secret");
const {
  setAccessAdminTokenCookie,
  setRefreshAdminTokenCookie,
  clearAdminCookies,
} = require("../helper/cookie");

const handleAdminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ✅ STEP 1: If token exists and is still valid, block login
    const token = req.cookies?.accessAdminToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_ACCESS_KEY);
        return res.status(400).json({ message: "Admin is already logged in" });
      } catch (err) {
        // ❗ Token invalid/expired — continue login
      }
    }

    // ✅ STEP 2: Find admin
    const admin = await User.findOne({ email });
    if (!admin) throw createError(404, "Admin does not exist with this email.");

    if (!admin.isAdmin) throw createError(403, "Not an admin.");

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch)
      throw createError(401, "Email/password did not match");

    // ✅ STEP 3: Create & set tokens
    const accessAdminToken = createJSONWebToken(
      { id: admin._id, isAdmin: true, email: admin.email },
      jwtAdminAccessKey,
      "24h"
    );
    setAccessAdminTokenCookie(res, accessAdminToken);

    const refreshAdminToken = createJSONWebToken(
      { id: admin._id, isAdmin: true, email: admin.email },
      jwtAdminRefreshKey,
      "7d"
    );
    setRefreshAdminTokenCookie(res, refreshAdminToken);

    const userWithoutPassword = admin.toObject();
    delete userWithoutPassword.password;

    return successResponse(res, {
      statusCode: 200,
      message: "Admin logged in successfully",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleAdminLogout = async (req, res, next) => {
  try {
    // if (req.session) {
    //   await new Promise((resolve, reject) => {
    //     req.session.destroy((err) => {
    //       if (err) reject(err);
    //       else resolve();
    //     });
    //   });
    // }

    clearAdminCookies(res); // ✅ Clear cookie

    return successResponse(res, {
      statusCode: 200,
      message: "Admin logged out successfully",
      payload: {},
    });
  } catch (error) {
    console.error("Logout failed:", error.message);
    next(error);
  }
};

const handleAdminRefreshToken = async (req, res) => {
  try {
    const oldRefreshAdminToken = req.cookies.refreshAdminToken;

    if (!oldRefreshAdminToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(oldRefreshAdminToken, jwtAdminRefreshKey);
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // পুরা decodedToken ব্যবহার কর
    const payload = {
      id: decodedToken.id,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin,
    };

    const accessAdminToken = createJSONWebToken(
      payload,
      jwtAdminAccessKey,
      "24h"
    );

    setAccessAdminTokenCookie(res, accessAdminToken);

    return res.status(200).json({
      statusCode: 200,
      message: "New access token is generated",
      payload: {},
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleAdminProtectedRoute = async (req, res, next) => {
  try {
    const accessAdminToken = req.cookies.accessAdminToken;

    const decodedToken = jwt.verify(accessAdminToken, jwtAdminAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token. Please login again.");
    }

    // সফলভাবে রেসপন্স পাঠানো হচ্ছে
    return successResponse(res, {
      statusCode: 200,
      message: "Protected resources accessed successfully",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

const handleGetAdminProfile = async (req, res) => {
  try {
    const adminId = req.user?._id;

    const admin = await User.findById(adminId).select("-password");

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    res.json({
      message: "Admin profile fetched successfully",
      payload: admin,
    });
  } catch (error) {
    console.error("Admin Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleUpdateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user._id;

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    // 🔹 Image থাকলে Cloudinary তে আপলোড করো
    if (req.file) {
      const result = await uploadSingleBuffer(
        req.file.buffer,
        "ecommerceMern/admins"
      );

      updates.image = result.secure_url;
    }

    // 🔹 Password থাকলে সেটার হ্যান্ডলিং Mongoose setter করবে
    if (req.body.password) {
      updates.password = req.body.password;
    }

    const updatedAdmin = await User.findByIdAndUpdate(adminId, updates, {
      new: true,
    }).select("-password");

    res.json({
      message: "Admin profile updated successfully",
      payload: updatedAdmin,
    });
  } catch (error) {
    console.error("Admin Profile update error:", error);
    res.status(500).json({ message: "Failed to update admin profile" });
  }
};

module.exports = {
  handleAdminLogin,
  handleAdminLogout,
  handleAdminRefreshToken,
  handleAdminProtectedRoute,
  handleGetAdminProfile,
  handleUpdateAdminProfile,
};
