const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;

const User = require("../models/userModel");
const { findWithId } = require("./findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const emailWithNodeMailer = require("../helper/email");
const { jwtResetPasswordKey, clientURL } = require("../secret");
const sendEmail = require("../helper/sendEmail");
const {
  publicIdWithoutExtensionFromUrl,
  deleteFileFromCloudinary,
} = require("../helper/cloudinaryHelper");

const handleUserAction = async (userId, action) => {
  try {
    const user = await findWithId(User, userId);

    if (action === "ban") {
      if (user.isBanned) {
        throw createError(400, "User is already banned");
      }
    } else if (action === "unban") {
      if (!user.isBanned) {
        throw createError(400, "User is already unbanned");
      }
    } else {
      throw createError(400, 'Invalid action. Use "ban" or "unban"');
    }

    const update = { isBanned: action === "ban" };
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
      context: "query",
    }).select("-password");

    return {
      message: `User was ${action}ned successfully`,
      user: updatedUser,
    };
  } catch (error) {
    throw error;
  }
};

const findUsers = async (search, limit, page) => {
  try {
    // সার্চের জন্য রেগুলার এক্সপ্রেশন তৈরি করা হচ্ছে
    const searchRegExp = new RegExp(".*" + search + ".*");

    // অ্যাডমিন বাদ দিয়ে ইউজার ফিল্টার করা হচ্ছে
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 }; // পাসওয়ার্ড বাদ দিয়ে তথ্য দেখানো হবে

    // ইউজারদের ডেটাবেইস থেকে রিড করা হচ্ছে
    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users || users.length === 0) throw createError(404, "no users found");

    return {
      users,
      pagination: {
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        previousPage: page - 1 > 0 ? page - 1 : null,
        nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      },
    };
  } catch (error) {
    throw error;
  }
};

const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);
    if (!user) throw createError(404, "User not found");
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (userId, req) => {
  try {
    const options = { password: 0 };
    const user = await findUserById(userId, options);
    if (!user) {
      throw createError(404, "User not found");
    }

    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    const allowedFields = ["name", "password", "phone", "address"];

    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      } else if (key === "email") {
        throw createError(400, "Email can not be updated");
      }
    }

    // ✅ Debug logs
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    // ✅ Image upload handling
    if (req.file) {
      if (req.file.size > 1024 * 1024 * 2) {
        throw new Error("File too large. It must be less than 2 MB");
      }

      try {
        const response = await cloudinary.uploader.upload(req.file.path, {
          folder: "ecomerceMern/users",
        });
        updates.image = response.secure_url;
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw createError(500, "Image upload failed");
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    );
    if (!updatedUser) {
      throw createError(404, "User with this ID does not exist");
    }

    // ✅ Delete previous image
    if (user.image) {
      try {
        const publicId = await publicIdWithoutExtensionFromUrl(user.image);
        await deleteFileFromCloudinary("ecomerceMern/users", publicId, "User");
      } catch (imgDeleteErr) {
        console.warn("Old image delete failed:", imgDeleteErr.message);
      }
    }

    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  } catch (error) {
    console.error("🔥 Update User Error:", error?.message || error);
    console.error(error?.stack || error);
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    throw error;
  }
};

const updateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw createError(404, "User is not found with this email");
    }

    if (newPassword !== confirmPassword) {
      throw createError(400, "newPassword and comfirmPassword did not match");
    }

    //compare the password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Old password dit not match");
    }

    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not update successfully");
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    throw error;
  }
};

const forgetUserPasswordByEmail = async (email) => {
  try {
    const userData = await User.findOne({ email: email });

    if (!userData) {
      throw createError(
        404,
        "Email is incorrect or you have not verified your email address. Please register yourself first"
      );
    }

    const tokenPayload = {
      email,
    };
    // নতুন ইউজারের জন্য JWT টোকেন তৈরি করা হচ্ছে

    const token = createJSONWebToken(tokenPayload, jwtResetPasswordKey, "10m");

    // ইমেইল পাঠানোর ডেটা প্রস্তুত
    const emailData = {
      email,
      subject: "Reset Password Email",
      html: `
    <h2>Hello ${userData.name}</h2>
    <p>
      Please click here to 
      <a href="${clientURL}/reset-password/${token}" target="_blank">
        reset your password
      </a>
    </p>
  `,
    };

    // একাউন্ট অ্যাক্টিভেশনের ইমেইল পাঠানো হচ্ছে

    await sendEmail(emailData);

    return token;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    throw error;
  }
};

const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, jwtResetPasswordKey);

    if (!decoded) {
      throw createError(400, "Invalid or expired token");
    }

    const filter = { email: decoded.email };
    const updates = { password: password };
    const updateOptions = { new: true };

    const updatedUser = await User.findOneAndUpdate(
      filter,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Password reset failed");
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    throw error;
  }
};

const findByIDAnddelete = async (id, options = {}) => {
  try {
    // একবারেই ইউজার খুঁজে এবং ডিলিট করা হচ্ছে
    const existingUser = await User.findOneAndDelete({
      _id: id,
      isAdmin: false,
    });

    if (!existingUser) {
      return null; // পরে ইউজার না পাওয়া গেলে কন্ট্রোলারে 404 দেওয়া যাবে
    }

    // ইমেজ থাকলে ক্লাউডিনারি থেকে ডিলিট করা হচ্ছে
    if (existingUser.image?.url) {
      const publicId = await publicIdWithoutExtensionFromUrl(
        existingUser.image.url
      );
      await deleteFileFromCloudinary("ecomerceMern/users", publicId, "User");
    }

    return existingUser;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUsers,
  findUserById,
  findByIDAnddelete,
  updateUserById,
  updateUserPasswordById,
  forgetUserPasswordByEmail,
  resetPassword,
  handleUserAction,
};
