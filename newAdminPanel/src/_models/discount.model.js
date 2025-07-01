export const discountModel = {
  createdDate: Date,
  id: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  discountType: {
    type: String,
    enum: ['Product Discount', 'Buy X Get Y', 'Order Discount', 'Free Shipping'],
    default: 'Order Discount',
    required: true,
  },
  applicationMethod: {
    type: String,
    enum: ['Code', 'Automatic'],
    default: 'Code',
    required: true,
  },
  promoCode: {
    type: String,
    required: true,
  },
  discountDetails: {
    type: {
      type: String,
      enum: ['Percentage', 'Fixed'],
      default: 'Percentage',
      required: true,
    },
    amount: {
      type: Number,
      required: true, // if percentage then not exceed 100%
    },
  },
  purchaseMode: {
    type: String,
    enum: ['One-Time', 'All'],
    default: 'One-Time',
  },
  customerEligibility: {
    type: String,
    enum: ['Everyone', 'Selected Customers'],
    default: 'Everyone',
  },
  minimumOrderValue: {
    type: Number,
    default: 0,
  },
  dateRange: {
    beginsAt: {
      type: String, // date with time (MM-DD-YYYY HH:mm)
      required: true,
    },
    expiresAt: {
      type: String, // date with time (MM-DD-YYYY HH:mm)
    },
  },
};
