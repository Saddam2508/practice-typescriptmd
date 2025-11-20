const { uploadSingleBuffer } = require("../config/cloudinary");

/**
 * Single file upload by fieldname
 * @param {Array} files - req.files থেকে আসা সব ফাইল
 * @param {string} fieldname - যে ফিল্ডের ফাইল দরকার
 * @param {string} folder - Cloudinary folder path
 * @returns {string|null} - uploaded url অথবা null
 */
async function uploadFileByField(files, fieldname, folder) {
  if (!files || files.length === 0) return null;

  const file = files.find((f) => f.fieldname === fieldname);
  if (!file) return null;

  const uploaded = await uploadSingleBuffer(file.buffer, folder);
  return uploaded.secure_url;
}

/**
 * Multiple file upload by fieldname
 * @param {Array} files - req.files থেকে আসা সব ফাইল
 * @param {string} fieldname - যে ফিল্ডের ফাইল দরকার
 * @param {string} folder - Cloudinary folder path
 * @returns {Array} - uploaded urls array
 */
async function uploadMultipleByField(files, fieldname, folder) {
  if (!files || files.length === 0) return [];

  const targetFiles = files.filter((f) => f.fieldname === fieldname);
  const uploadedUrls = [];

  for (const file of targetFiles) {
    const uploaded = await uploadSingleBuffer(file.buffer, folder);
    uploadedUrls.push(uploaded.secure_url);
  }

  return uploadedUrls;
}

module.exports = {
  uploadFileByField,
  uploadMultipleByField,
};
