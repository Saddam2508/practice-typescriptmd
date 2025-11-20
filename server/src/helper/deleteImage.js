const fs = require("fs").promises;
const path = require("path");

const deleteImage = async (imagePath) => {
  try {
    const normalizedPath = imagePath
      .replace(/\\/g, "/")
      .replace(/^public\//, "");

    const fullPath = path.join(__dirname, "..", "..", "public", normalizedPath);

    await fs.access(fullPath);
    await fs.unlink(fullPath);

    console.log("✅ Image deleted:", fullPath);
  } catch (error) {
    console.error("❌ Image delete failed:", error.message);
  }
};

module.exports = { deleteImage };
