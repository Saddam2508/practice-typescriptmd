const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "The length of Product name can be minimum 3 characters"],
      maxlength: [
        150,
        "The length of Product name can be maximum 150 characters",
      ],
    },
    slug: {
      type: String,
      required: [true, "Product slug is required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [
        10,
        "The length of Product description can be minimum 10 characters",
      ],
    },
    features: {
      type: String,
      required: [true, "Product features is required"],
      trim: true,
      minlength: [
        10,
        "The length of Product features can be minimum 10 characters",
      ],
    },
    care: {
      type: String,
      required: [true, "Product care is required"],
      trim: true,
      minlength: [
        10,
        "The length of Product care can be minimum 10 characters",
      ],
    },
    shippings: {
      type: String,
      required: [true, "Product shippings is required"],
      trim: true,
      minlength: [
        10,
        "The length of Product shippings can be minimum 10 characters",
      ],
    },
    returns: {
      type: String,
      required: [true, "Product returns is required"],
      trim: true,
      minlength: [
        10,
        "The length of Product returns can be minimum 10 characters",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid price! Price must be greater than 0`,
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) =>
          `${props.value} is not a valid quantity! Quantity must be greater than 0`,
      },
    },
    sold: {
      type: Number,
      default: 0,
      trim: true,
      validate: {
        validator: (v) => v >= 0,
        message: (props) => `${props.value} is not a valid sold quantity!`,
      },
    },
    shipping: {
      type: Number,
      default: 0, // Free shipping if 0
    },
    currencySymbol: {
      type: String,
      default: "$",
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ✅ Extra Fields Already Present
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating can't be more than 5"],
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    codAvailable: {
      type: Boolean,
      default: true,
    },
    returnDays: {
      type: Number,
      default: 14,
    },
    warranty: {
      type: String,
      default: null,
    },

    // ✅ New Fields Added:

    // 🔹 Product Availability Status
    status: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Discontinued"],
      default: "In Stock",
    },

    // 🔹 Brand Name
    brand: {
      type: String,
      trim: true,
      default: "Generic",
    },

    // 🔹 Variants (Color, Size, Stock)
    variants: [
      {
        color: { type: String },
        size: { type: String },
        stock: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);
module.exports = Product;
