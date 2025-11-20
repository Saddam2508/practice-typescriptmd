const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const morgan = require("morgan");
const createError = require("http-errors");
const path = require("path");
const passport = require("passport");

require("./config/passport"); // Google OAuth config
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const userRouter = require("./routers/userRouter");
const { errorResponse } = require("./controllers/responseController");
const authRouter = require("./routers/authRouter");
const applyCors = require("./middlewares/corsHandler");
const adminRouter = require("./routers/adminRouter");
const seedRouter = require("./routers/seedRouter");
const headerRouter = require("./routers/headerRouter");
const userHeaderRouter = require("./routers/userHeaderRouter");
const sidebarRouter = require("./routers/sidebarRouter");
const menuRouter = require("./routers/menuRouter");
const adminHeaderRouter = require("./routers/adminHeaderRouter");
const siteInfoRouter = require("./routers/siteSettingRouter/siteInfoRouter");
const publicMenuRouter = require("./routers/publicMenuRouter");
const publicTopHeaderRouter = require("./routers/publicTopHeaderRouter");
const publicSubHeaderRouter = require("./routers/publicSubHeaderRouter");
const footerRouter = require("./routers/footerRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const productImageRouter = require("./routers/productImageRouter");
const locationRouter = require("./routers/locationRouter");
const orderRouter = require("./routers/orderRouter");
const promoRouter = require("./routers/promoRouter");
const footerRouterPra = require("./routers/footerRouterPra");
const publicSubHeaderPraRouter = require("./routers/publicSubHeaderPraRouter");
const bannerRouter = require("./routers/bannerRouter");
const bannerSettingRouter = require("./routers/bannerSettingRouter");
const notificationRouter = require("./routers/notificationRouter");

const app = express();
// ✅ CORS middleware প্রয়োগ করুন
applyCors(app);
// ✅ Other middleware
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// ✅ Rate limiter
const limiter = rateLimit({
  windowMs: 5000 * 60 * 1000,
  max: 5000,
  message: "Too many requests. Please try again later.",
});
app.use(limiter);

app.use(passport.initialize());

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "../client/build")));

// ✅ Routes
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/header", headerRouter);
app.use("/api/user-header", userHeaderRouter);
app.use("/api/sidebar", sidebarRouter);
app.use("/api/menus", menuRouter);
app.use("/api/public-menus", publicMenuRouter);
app.use("/api/admin-header", adminHeaderRouter);
app.use("/api/admin/top-header", publicTopHeaderRouter);
app.use("/api/admin/sub-header", publicSubHeaderRouter);
app.use("/api/admin/sub-header-pra", publicSubHeaderPraRouter);
app.use("/api/site-info", siteInfoRouter);
app.use("/api/footer", footerRouter);
app.use("/api/footer-pra", footerRouterPra);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/product-images", productImageRouter);
app.use("/api/location", locationRouter);
app.use("/api/orders", orderRouter);
app.use("/api/promos", promoRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/banner/settings", bannerSettingRouter);
app.use("/api/notifications", notificationRouter);

// ✅ Final fallback for React SPA
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// ✅ 404 handler
app.use((req, res, next) => {
  next(createError(404, "Route not found"));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status || 500,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
