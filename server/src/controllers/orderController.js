const Order = require("../models/orderModel");
const generateInvoicePdf = require("../utils/invoicePdfGenerator");
const VoucherTemplate = require("../models/voucherTemplateSettings");
const { streamPdf } = require("../helper/streamPdf");
const pdfDownloadHelper = require("../helper/pdfDownloadHelper");

// 1. Create Order with Invoice
const handleCreateOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const mappedItems = items.map((item) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: mappedItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      status: "Processing",
      orderedAt: new Date(),
    });

    // Populate order for invoice generation
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name price");

    // Get latest voucher/company settings
    const setting = await VoucherTemplate.findOne().sort({ createdAt: -1 });

    // Generate PDF and upload to Cloudinary
    const invoicePdfUrl = await generateInvoicePdf({
      order: populatedOrder,
      setting,
    });

    // Save invoice URL to order
    order.invoiceUrl = invoicePdfUrl;
    await order.save();

    res.status(201).json({
      message: "Order created and invoice generated",
      order,
      invoicePdfUrl,
    });
  } catch (err) {
    console.error("❌ Order Creation Error:", err);
    res.status(500).json({ message: "Server error while creating order" });
  }
};

// 2. Get All Orders (for admin)
const handlegetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ orderedAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders." });
  }
};

// 3. Update Order Status
const handleupdateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== status) {
      order.status = status;

      if (status === "Shipped") {
        order.shippedAt = new Date();
      } else if (status === "Delivered") {
        order.deliveredAt = new Date();
      } else if (status === "Cancelled") {
        order.cancelledAt = new Date();
      }
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Order Status Update Error:", error);
    res.status(500).json({ message: "Failed to update order." });
  }
};

// 4. Delete Order
const handledeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Order Error:", error);
    res.status(500).json({ message: "Failed to delete order." });
  }
};

// 5. Get User Orders
const handleGetUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId })
      .populate("items.product", "name image slug")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch User Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

// Invoice PDF browser view (redirect to invoiceUrl)
const streamInvoicePdf = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user"); // ✅ populate

    if (!order || !order.invoiceUrl) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ✅ Access control: allow admin or the order's owner
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Stream with inline Content-Disposition
    await streamPdf(req, res, order.invoiceUrl, `invoice-${orderId}`);
  } catch (error) {
    console.error("Error streaming invoice PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Invoice PDF download (using pdfDownloadHelper)
const downloadInvoicePdf = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate("user");

    if (!order || !order.invoiceUrl) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ✅ Access control: only admin or owner can download
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // ✅ Download PDF using helper
    await pdfDownloadHelper(
      {
        model: Order,
        query: { _id: orderId },
        urlField: "invoiceUrl",
        filenamePrefix: "invoice-",
      },
      req,
      res
    );
  } catch (error) {
    console.error("Error downloading invoice PDF:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleCreateOrder,
  handlegetAllOrders,
  handleupdateOrderStatus,
  handledeleteOrder,
  handleGetUserOrders,
  streamInvoicePdf,
  downloadInvoicePdf,
};
