const fetch = require("node-fetch");

const reverseGeocode = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "YourAppName/1.0 (eyarinsultana@gmail.com)", // আপনার অ্যাপ বা ইমেইল দিন
        },
      }
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Reverse geocode fetch error:", error);
    res.status(500).json({ message: "Failed to fetch location" });
  }
};

module.exports = { reverseGeocode };
