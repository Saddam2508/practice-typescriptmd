const mongoose = require("mongoose");

const footerSchema = new mongoose.Schema({
  text: String,
  slogan: String,
  logoUrl: String, // Optional: লোগো preview support

  // Social links
  socialLinks: [
    {
      platform: { type: String, required: true },
      url: { type: String, required: true },
      iconUrl: String, // Optional: Custom image icon
      iconClass: String, // Optional: Font Awesome বা অন্য icon class
    },
  ],

  // Sections
  sections: [
    {
      title: { type: String, required: true },
      links: [
        {
          label: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
  ],

  // App Links (dynamic URL + image)
  appLinks: [
    {
      title: { type: String, required: true }, // ex: "Google Play" / "App Store"
      url: { type: String, required: true }, // clickable link
      imageUrl: { type: String, required: true }, // image path or URL
      show: { type: Boolean, default: true }, // show/hide flag
    },
  ],

  // Payment Methods
  paymentMethods: [
    {
      title: String, // ex: "Visa", "MasterCard"
      imageUrl: String, // ex: "/visa.png"
      show: { type: Boolean, default: true }, // optional show/hide
    },
  ],
});

module.exports = mongoose.model("Footer", footerSchema);
