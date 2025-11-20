// প্রয়োজনীয় মডিউল/প্যাকেজ গুলো ইমপোর্ট করা হচ্ছে
const createError = require("http-errors");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { uploadSingleBuffer } = require("../config/cloudinary");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const {
  jwtActivationKey,
  clientURL,
  jwtResetPasswordKey,
} = require("../secret");
const emailWithNodeMailer = require("../helper/email");
const runValidation = require("../validators");
const { Context } = require("express-validator/lib/context");
const deleteImageHelper = require("../helper/deleteImageHelper");
const { type } = require("os");
const {
  handleUserAction,
  findUsers,
  findUserById,
  findByIDAnddelete,
  updateUserPasswordById,
  forgetUserPasswordByEmail,
  resetPassword,
  updateUserById,
} = require("../services/userService");
const { default: mongoose } = require("mongoose");
const checkUserExists = require("../helper/checkUserExists");
const sendEmail = require("../helper/sendEmail");

// সকল ইউজার লোড করার ফাংশন
const handleGetUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;

    const { users, pagination } = await findUsers(search, limit, page);

    // ✅ প্রতিটি ইউজারের মধ্যে status ফিল্ড যোগ করছি
    const usersWithStatus = users.map((user) => ({
      ...user.toObject(),
      status: user.isBanned ? "blocked" : "active",
    }));

    return successResponse(res, {
      statusCode: 200,
      message: "users were returned successfully",
      payload: {
        users: usersWithStatus,
        pagination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// নির্দিষ্ট একটি ইউজার লোড করার ফাংশন
const handleGetUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 }; // পাসওয়ার্ড বাদ
    const user = await findUserById(id, options);
    return successResponse(res, {
      statusCode: 200,
      message: "user was returned successfully",
      payload: { user },
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    next(error);
  }
};

const handleGetMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }
    console.log(user);
    return successResponse(res, {
      statusCode: 200,
      message: "User profile fetched successfully",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
};

const handleUpdateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const updates = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    if (req.file) {
      const result = await uploadSingleBuffer(
        req.file.buffer,
        "ecommerceMern/users"
      );

      // আপলোডের URL নাও
      updates.image = result.secure_url; // ক্লাউডিনারির https ইউআরএল
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// নির্দিষ্ট ইউজার ডিলিট করার ফাংশন
const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletedUser = await findByIDAnddelete(id);

    if (!deletedUser) {
      throw createError(404, "User not found or already deleted");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was deleted successfully",
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return next(createError(400, "Invalid User ID"));
    }

    next(error);
  }
};

// ইউজার রেজিস্ট্রেশনের প্রসেসিং ফাংশন
const handleProcessRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const image = req.file; // Multer থেকে image আসবে
    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(400, "File too large. It must be less than 2 MB");
    }

    // আগে থেকে ইউজার আছে কিনা চেক করা হচ্ছে
    const userExists = await checkUserExists(email);
    if (userExists) {
      throw createError(
        409,
        "User with this email already exits. Please sign in"
      );
    }

    // নতুন ইউজারের জন্য JWT টোকেন তৈরি করা হচ্ছে
    const tokenPayload = {
      name,
      email,
      password,
      phone,
      address,
    };
    // যদি image থাকে
    // if (image) {
    //   tokenPayload.image = image;
    // }

    if (image) {
      tokenPayload.image = image.path; // ✅ শুধু path পাঠান
    }

    const token = createJSONWebToken(tokenPayload, jwtActivationKey, "10m");

    // ইমেইল পাঠানোর ডেটা প্রস্তুত
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
    <h2>Hello ${name}</h2>
    <p>Please click here to 
      <a href="${clientURL}/verify?token=${token}" target="_blank">
        activate your account
      </a>
    </p>
  `,
    };

    // const emailData = {
    //   email,
    //   subject: "Account Activation Email",
    //   html: `
    //   <h2> Hello ${name}</h2>
    //   <p> Please click here to <a href = "${clientURL}/api/users/activate/${token}" target = "_blank"> activate your account </a> </p>
    //   `,
    // };

    // একাউন্ট অ্যাক্টিভেশনের ইমেইল পাঠানো হচ্ছে
    await sendEmail(emailData);

    const newUser = { name, email, password, phone, address };

    return successResponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for completing your registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// অ্যাকাউন্ট অ্যাক্টিভেশনের ফাংশন
const handleActivateAccount = async (req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.params.token;

    if (!token) throw createError(404, "token not found");

    try {
      // টোকেন যাচাই
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(404, "user was not able to verified");

      // আগেই ইউজার আছে কিনা চেক
      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "User with this email already exists. Please sign in"
        );
      }

      // ইমেজ থাকলে ক্লাউডিনারিতে আপলোড করো
      if (decoded.image) {
        // যদি decoded.image base64 হয়
        const imageBuffer = Buffer.from(
          decoded.image.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );

        const result = await uploadSingleBuffer(
          imageBuffer,
          "ecommerceMern/users"
        );

        decoded.image = result.secure_url;
      }

      // ইউজার তৈরি
      await User.create(decoded);

      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// নির্দিষ্ট ইউজার আপডেট করার ফাংশন

const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userWithoutPassword = await updateUserById(userId, req);

    return successResponse(res, {
      statusCode: 200,
      message: "user was updated successfully",
      payload: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// const handleUpdateUserById = async (req, res, next) => {
//   try {
//     const userId = req.params.id || req.body.id;
//     const options = { password: 0 };
//     const user = await findWithId(User, userId, options);
//     const updateOptions = { new: true, runValidation: true, Context: "query" };
//     let updates = {};

//     const allowedFields = ["name", "password", "phone", "address"];

//     for (const key in req.body) {
//       if (allowedFields.includes(key)) {
//         updates[key] = req.body[key];
//       } else if (key === "email") {
//         throw createError(400, "Email can not be updated");
//       }
//     }

//     const image = req.file;
//     if (image) {
//       if (image.size > 1024 * 1024 * 2) {
//         throw createError(400, "File too large. It must be less than 2 MB");
//       }

//       updates.image = image.buffer.toString("base64"); // ✅ এটা সঠিক
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       updates,
//       updateOptions
//     );
//     if (!updatedUser) {
//       throw createError(404, "User with this ID does not exist");
//     }
//     // ✅ Convert to plain object & remove password
//     const userWithoutPassword = updatedUser.toObject();
//     delete userWithoutPassword.password;

//     return successResponse(res, {
//       statusCode: 200,
//       message: "user was updated successfully",
//       payload: { userWithoutPassword },
//     });
//   } catch (error) {
//     if (error instanceof mongoose.Error.CastError) {
//       throw createError(404, "Invalid Id");
//     }
//     next(error);
//   }
// };

// নির্দিষ্ট ইউজার Ban করার ফাংশন

const handleManagerUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id || req.body.id;
    const action = req.body.action;
    const { user, message } = await handleUserAction(userId, action);

    // ✅ Add status manually for frontend
    const userWithStatus = {
      ...(user.toObject?.() || user),
      status: user.isBanned ? "blocked" : "active",
    };

    return successResponse(res, {
      statusCode: 200,
      message: message,
      payload: userWithStatus, // Send enhanced object
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }

    next(error);
  }
};

// নির্দিষ্ট ইউজার Unban করার ফাংশন
const handleUpdatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id || req.body.id;
    const updatedUser = await updateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmPassword
    );
    return successResponse(res, {
      statusCode: 200,
      message: "User password updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    next(error);
  }
};
// নির্দিষ্ট ইউজার Unban করার ফাংশন
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const token = await forgetUserPasswordByEmail(email);

    return successResponse(res, {
      statusCode: 200,
      message: `please go to your ${email} for reseting the password`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

// নির্দিষ্ট ইউজার Unban করার ফাংশন
const handleResetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params; // ✅ token এখন URL params থেকে নিচ্ছি
    const updatedUser = await resetPassword(token, password);
    return successResponse(res, {
      statusCode: 200,
      message: "password reset successfully",
      payload: updatedUser,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw createError(404, "Invalid Id");
    }
    next(error);
  }
};

// নির্দিষ্ট ইউজার Unban করার ফাংশন
const handleUnbanUserById = async (req, res, next) => {
  try {
    const userId = req.params.id || req.body.id;

    // ইউজার খুঁজে বের করুন (যদি না থাকে তাহলে findWithId এর ভেতরেই error আসবে)
    const user = await findWithId(User, userId);

    // যদি user আগে থেকেই unbanned হয়
    if (user.isBanned === false) {
      throw createError(400, "User is already unbanned");
    }

    // না হলে unban করুন
    const updates = { isBanned: false };
    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "User was not unbanned successfully");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "User was unbanned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// এক্সপোর্ট করে রাখা হলো যাতে অন্য জায়গা থেকে ফাংশন গুলো ব্যবহার করা যায়
module.exports = {
  handleGetUsers,
  handleGetUserById,
  handleGetMyProfile,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateAccount,
  handleUpdateUserProfile,
  handleUpdateUserById,
  handleManagerUserStatusById,
  handleUnbanUserById,
  handleUpdatePassword,
  handleForgetPassword,
  handleResetPassword,
};
