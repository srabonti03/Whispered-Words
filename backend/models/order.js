const mongoose = require('mongoose');

const generateOrderNumber = () => {
  const prefix = 'wspr';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000);
  return `${prefix}${timestamp}${random}`;
};

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: generateOrderNumber,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'books',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending','out of delivery', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'bKash'],
      default: 'COD',
    },
    placeOrderTimestamp: {
      type: Date,
      required: true,
    },
    paymentDetails: {
      cardNumber: {
        type: String,
        required: function () {
          return this.paymentMethod === 'Card';
        },
      },
      expiryDate: {
        type: String,
        required: function () {
          return this.paymentMethod === 'Card';
        },
      },
      cvc: {
        type: String,
        required: function () {
          return this.paymentMethod === 'Card';
        },
      },
      cardName: {
        type: String,
        required: function () {
          return this.paymentMethod === 'Card';
        },
      },
      bkashPhoneNumber: {
        type: String,
        required: function () {
          return this.paymentMethod === 'bKash';
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, placeOrderTimestamp: 1 });

module.exports = mongoose.model('Order', orderSchema);
