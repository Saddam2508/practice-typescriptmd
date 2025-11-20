const multer = require("multer");
const memoryStorage = multer.memoryStorage();

const {
  UPLOAD_USER_IMG_DIRECTORY,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_PRODUCT_IMG_DIRECTORY,
} = require("../config");

const userStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, UPLOAD_USER_IMG_DIRECTORY);
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const productStorage = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   cb(null, UPLOAD_PRODUCT_IMG_DIRECTORY);
  // },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error("File type is not allowed"), false);
  }
  cb(null, true);
};
const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

const uploadUserImageMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadAdminImageMemory = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadLogoOrIcons = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});
const uploadCategoryImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadProductImageCloud = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadBanner = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadPortfolioBanner = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadResume = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadMultiple = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
const testimonialUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
const manuUpload = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

// ✅ Reusable socialIconUploader middleware
const MAX_SOCIAL_ICONS = 10;
const MAX_APP_LINKS = 5;
const MAX_PAYMENT_METHODS = 5;

const socialIconUploader = uploadLogoOrIcons.fields([
  { name: "logo", maxCount: 1 },

  // social icons
  ...Array.from({ length: MAX_SOCIAL_ICONS }, (_, i) => ({
    name: `socialIconFile_${i}`,
    maxCount: 1,
  })),

  // app links
  ...Array.from({ length: MAX_APP_LINKS }, (_, i) => ({
    name: `appLinkFile_${i}`,
    maxCount: 1,
  })),

  // payment methods
  ...Array.from({ length: MAX_PAYMENT_METHODS }, (_, i) => ({
    name: `paymentFile_${i}`,
    maxCount: 1,
  })),
]);

module.exports = {
  uploadUserImage,
  uploadLogoOrIcons,
  socialIconUploader,
  uploadBanner,
  uploadUserImageMemory,
  uploadAdminImageMemory,
  uploadPortfolioBanner,
  uploadMultiple,
  testimonialUpload,
  manuUpload,
  uploadResume,
  uploadProductImage,
  uploadCategoryImage,
  uploadProductImageCloud,
};
