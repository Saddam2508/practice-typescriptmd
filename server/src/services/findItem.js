const createError = require("http-errors");
const mongoose = require("mongoose");

const findWithId = async (Model, id, options = {}) => {
  try {
    // ✅ প্রথমেই ID valid কি না চেক করুন
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid item id");
    }

    const item = await Model.findById(id).select(options);

    if (!item) {
      throw createError(404, `${Model.modelName} does not exist with this id`);
    }

    return item;
  } catch (error) {
    throw error;
  }
};
module.exports = { findWithId };

// const findWithId = async (Model, id, options = {}) => {
//   try {
//     const item = await Model.findById(id, options);
//     if (!item) {
//       throw createError(404, `${Model.modelName} does not exist with this id`);
//     }
//     return item;
//   } catch (error) {
//     if (error instanceof mongoose.Error) {
//       throw createError(400, "Invalid item id");
//     }
//     throw error;
//   }
// };
