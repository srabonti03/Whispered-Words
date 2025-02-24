const router = require("express").Router();
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const moment = require('moment');

// Placing order - COD
router.post("/placeorder", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: "No books in the order." });
    }

    const placeOrderTimestamp = new Date();
    const ordersToSave = order.map(orderData => ({
      user: id,
      book: orderData._id,
      price: orderData.price,
      placeOrderTimestamp,
      status: 'Pending',
      paymentMethod: 'COD',
    }));

    const savedOrders = await Order.insertMany(ordersToSave);

    await User.findByIdAndUpdate(id, { $push: { order: { $each: savedOrders.map(order => order._id) } } });
    await User.findByIdAndUpdate(id, { $pull: { cart: { $in: order.map(orderData => orderData._id) } } });

    return res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error placing order:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Placing Order - Card
router.post('/cardpayment', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { order, paymentDetails } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: 'No items in the order.' });
    }

    if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc || !paymentDetails.cardName) {
      return res.status(400).json({ message: 'Payment details are required.' });
    }

    const placeOrderTimestamp = new Date();
    const ordersToSave = order.map(orderData => ({
      user: id,
      book: orderData._id,
      price: orderData.price,
      placeOrderTimestamp,
      status: 'Pending',
      paymentMethod: 'Card',
      paymentDetails: {
        cardNumber: paymentDetails.cardNumber,
        expiryDate: paymentDetails.expiryDate,
        cvc: paymentDetails.cvc,
        cardName: paymentDetails.cardName,
      },
    }));

    const savedOrders = await Order.insertMany(ordersToSave);

    const totalAmount = order.reduce((sum, item) => sum + item.price, 0);

    await User.findByIdAndUpdate(id, { $push: { order: { $each: savedOrders.map(order => order._id) } } });
    await User.findByIdAndUpdate(id, { $pull: { cart: { $in: order.map(orderData => orderData._id) } } });

    return res.status(201).json({ message: 'Order placed successfully', orders: savedOrders, totalAmount });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Placing Order
router.post('/bkashpayment', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const { order, paymentDetails } = req.body;

    if (!order || order.length === 0) {
      return res.status(400).json({ message: 'No items in the order.' });
    }

    if (!paymentDetails || !paymentDetails.bkashPhoneNumber) {
      return res.status(400).json({ message: 'bKash payment details are required.' });
    }

    let { bkashPhoneNumber } = paymentDetails;

    if (!bkashPhoneNumber.startsWith('+880')) {
      return res.status(400).json({ message: 'Please provide a valid bKash phone number with country code (+880).' });
    }

    bkashPhoneNumber = '+880 ' + bkashPhoneNumber.slice(4).replace(/\D/g, '');

    const placeOrderTimestamp = new Date();

    const ordersToSave = order.map(orderData => ({
      user: id,
      book: orderData._id,
      price: orderData.price,
      placeOrderTimestamp,
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentDetails: {
        bkashPhoneNumber,
      },
    }));

    const savedOrders = await Order.insertMany(ordersToSave);

    const totalAmount = order.reduce((sum, item) => sum + item.price, 0);

    await User.findByIdAndUpdate(id, { $push: { order: { $each: savedOrders.map(order => order._id) } } });
    await User.findByIdAndUpdate(id, { $pull: { cart: { $in: order.map(orderData => orderData._id) } } });

    return res.status(201).json({
      message: 'Order placed successfully with bKash payment.',
      orders: savedOrders,
      totalAmount,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Get order history of a particular user
router.get("/orderhistory", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const orders = await Order.find({ user: id })
      .populate({
        path: 'book',
        select: 'title author price desc',
      })
      .sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all users' orders
router.get("/allorders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 1,
          orderNumber: 1,
          status: 1,
          paymentMethod: 1,
          placeOrderTimestamp: 1,
          "userDetails.name": 1,
          "userDetails.email": 1,
          "bookDetails.title": 1,
          "bookDetails.author": 1,
          "bookDetails.price": 1,
          "userDetails.username": 1,
          "userDetails.email": 1,
          "userDetails.address": 1,
          total: "$bookDetails.price",
        },
      },
    ]);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Change status of all books in a specific order
router.put("/orders/status", authenticateToken, async (req, res) => {
  const { placeOrderTimestamp, newStatus } = req.body;

  if (!placeOrderTimestamp || !newStatus) {
    return res.status(400).json({ message: "Place order timestamp and new status are required" });
  }

  const validStatuses = ['Pending', 'Out for Delivery', 'Completed', 'Cancelled'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status provided" });
  }

  try {
    const result = await Order.updateMany(
      { placeOrderTimestamp: placeOrderTimestamp },
      { $set: { status: newStatus } }
    );

    if (result.nModified === 0) {
      return res.status(404).json({ message: "No orders found with the specified place order timestamp" });
    }

    res.status(200).json({
      message: "Order statuses updated successfully",
      updatedCount: result.nModified,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get today's sales amount
router.get("/todaysales", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const dailySales = await Order.aggregate([
      {
        $lookup: {
          from: "books",
          localField: "book",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $match: {
          placeOrderTimestamp: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$bookDetails.price" },
        },
      },
      {
        $project: {
          totalSales: 1,
        },
      },
    ]);

    if (!dailySales || dailySales.length === 0) {
      return res.status(404).json({ message: "No sales found for today" });
    }

    res.status(200).json({
      message: "Today's sales fetched successfully",
      data: dailySales,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get today's total orders count
router.get("/todayorders", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const totalOrders = await Order.aggregate([
      {
        $match: {
          placeOrderTimestamp: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
          status: { $in: ['Pending', 'out of delivery', 'Completed'] },
        },
      },
      {
        $count: "totalOrders",
      },
    ]);

    if (!totalOrders || totalOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for today" });
    }

    res.status(200).json({
      message: "Today's total orders fetched successfully",
      data: totalOrders[0].totalOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get dynamic weekly sales (7 days)
router.get("/weeklysales", async (req, res) => {
  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklySales = await Order.aggregate([
      {
        $match: {
          placeOrderTimestamp: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          status: { $in: ['Pending', 'out of delivery', 'Completed'] },
        },
      },
      {
        $project: {
          day: { $dayOfWeek: "$placeOrderTimestamp" },
        },
      },
      {
        $group: {
          _id: "$day",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dayNames = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const formattedData = Array.from({ length: 7 }, (_, i) => {
      const dayOfWeek = (i + 1) % 7;
      const daySales = weeklySales.find(day => day._id === dayOfWeek);

      if (i > today.getDay()) return null;

      return {
        day: dayNames[i],
        totalOrders: daySales?.totalOrders || 0,
      };
    }).filter(day => day !== null);

    res.status(200).json({
      message: "Dynamic weekly sales data fetched successfully",
      currentDay: dayNames[today.getDay()],
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get dynamic monthly sales (30 days)
router.get("/monthlysales", async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

    const monthlySales = await Order.aggregate([
      {
        $match: {
          placeOrderTimestamp: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          status: { $in: ['Pending', 'out of delivery', 'Completed'] },
        },
      },
      {
        $project: {
          day: { $dayOfMonth: "$placeOrderTimestamp" },
        },
      },
      {
        $group: {
          _id: "$day",
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[today.getMonth()];
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const dailySales = [];
    const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= today.getDate(); day++) {
      const salesData = monthlySales.find(sale => sale._id === day);
      dailySales.push({
        day: day,
        totalOrders: salesData ? salesData.totalOrders : 0,
      });
    }

    res.status(200).json({
      message: `Sales data for ${currentMonth} fetched successfully`,
      currentDate: formattedDate,
      data: {
        month: currentMonth,
        dailySales,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Get dynamic yearly sales (12 months)
router.get("/yearlysales", async (req, res) => {
  try {
    const today = new Date();
    const currentYear = today.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

    const yearlySales = await Order.aggregate([
      {
        $match: {
          placeOrderTimestamp: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
          status: { $in: ['Pending', 'out of delivery', 'Completed'] },
        },
      },
      {
        $group: {
          _id: {
            $month: "$placeOrderTimestamp",
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[today.getMonth()];

    const data = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalOrders: yearlySales.find(month => month._id === i + 1)?.totalOrders || 0,
    })).filter(month => month.totalOrders > 0);

    res.status(200).json({
      message: "Dynamic yearly sales data fetched successfully",
      currentMonth: currentMonth,
      year: currentYear,
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Payment Invoice
router.get("/invoice", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id).select("username email address");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const lastOrder = await Order.findOne({ user: id }).sort({ createdAt: -1 });
    if (!lastOrder) {
      return res.status(404).json({ message: "No orders found." });
    }

    const { placeOrderTimestamp } = lastOrder;

    const orders = await Order.find({ user: id, placeOrderTimestamp })
      .populate({
        path: "book",
        select: "title author price url desc",
      })
      .select("paymentMethod createdAt orderNumber");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found from the current session." });
    }

    res.json({ user, orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Payment Invoice by placeOrderTimestamp
router.get("/invoice/timestamp/:timestamp", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { timestamp } = req.params;
    const decodedTimestamp = decodeURIComponent(timestamp);
    const formattedTimestamp = new Date(decodedTimestamp).toISOString();

    const user = await User.findById(id).select("username email address");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({
      user: id,
      placeOrderTimestamp: { $gte: new Date(formattedTimestamp), $lt: new Date(new Date(formattedTimestamp).getTime() + 60 * 60 * 1000) }
    })
    .populate({
      path: "book",
      select: "title author price url desc",
    })
    .select("paymentMethod createdAt orderNumber");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for the given timestamp." });
    }
    res.json({ user, orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

module.exports = router;