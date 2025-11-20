const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction, // ✅ লোকালে false, প্রোডাকশনে true
  sameSite: isProduction ? "none" : "lax", // ✅ প্রোডাকশনে none, লোকালে lax
  path: "/", // path issue এড়াতে সব সময় রাখো
};

// user panel এর জন্য

const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 5 minutes
  });
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions); // ✅ must include options
  res.clearCookie("refreshToken", cookieOptions);
};

// admin panel এর জন্য

const setAccessAdminTokenCookie = (res, accessAdminToken) => {
  res.cookie("accessAdminToken", accessAdminToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, // 5 minutes
  });
};

const setRefreshAdminTokenCookie = (res, refreshAdminToken) => {
  res.cookie("refreshAdminToken", refreshAdminToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const clearAdminCookies = (res) => {
  res.clearCookie("accessAdminToken", cookieOptions); // ✅ must include options
  res.clearCookie("refreshAdminToken", cookieOptions);
};

module.exports = {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  setAccessAdminTokenCookie,
  setRefreshAdminTokenCookie,
  clearAdminCookies,
};
