const fs = require("fs/promises");
const deleteImageHelper = async (imagePath) => {
  try {
    console.log("delete image");
    await fs.access(imagePath);
    await fs.unlink(imagePath);
    console.log("User image was deleted");
  } catch (error) {
    console.error("User image does not exist or could not be deleted");
    // You may choose to throw an error here if needed
    throw error;
  }
};
module.exports = deleteImageHelper;
