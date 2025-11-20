const cloudinary = require("cloudinary").v2;

const publicIdWithoutExtensionFromUrl = (imageUrl) => {
  const pathSegments = imageUrl.split("/");
  const fileName = pathSegments[pathSegments.length - 1];
  const lastDotIndex = fileName.lastIndexOf(".");
  const publicId =
    lastDotIndex !== -1 ? fileName.substring(0, lastDotIndex) : fileName;
  return publicId;
};

const deleteFileFromCloudinary = async (folderName, publicId, modelName) => {
  try {
    const { result } = await cloudinary.uploader.destroy(
      `${folderName}/${publicId}`
    );
    if (result !== "ok") {
      throw new Error(
        `${modelName} image was not deleted successfully from cloudinary. Please try again`
      );
    }
  } catch (error) {
    throw Error;
  }
};

module.exports = { publicIdWithoutExtensionFromUrl, deleteFileFromCloudinary };
