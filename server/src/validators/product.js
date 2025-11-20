const { body } = require("express-validator");

const validateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Product name should be 3–150 characters long"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 10 })
    .withMessage("Description should be at least 10 characters long."),

  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("quantity")
    .trim()
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer."),

  body("sold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold must be 0 or a positive integer."),

  body("shipping")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Shipping must be 0 or a positive number."),

  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5."),

  body("totalRatings")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total ratings must be a non-negative integer."),

  body("codAvailable")
    .optional()
    .isBoolean()
    .withMessage("COD availability must be true or false."),

  body("returnDays")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Return days must be a non-negative integer."),

  body("warranty")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Warranty must be a string up to 100 characters."),

  body("category").trim().notEmpty().withMessage("Category is required."),

  body("image")
    .optional()
    .isString()
    .withMessage("Product image must be a valid URL or string."),
];

module.exports = { validateProduct };
