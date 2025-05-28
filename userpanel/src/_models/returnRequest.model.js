export const returnRequestModel = {
  createdDate: Date,
  updatedDate: Date,
  id: {
    type: String,
    unique: true,
    required: true,
  },
  orderId: {
    type: String,
    ref: "order",
  },
  orderNumber: {
    type: String,
    ref: "order",
  },
  userId: {
    type: String,
    ref: "user",
  },
  products: {
    type: [
      {
        productId: {
          type: String,
        },
        variations: {
          type: [
            {
              variationId: {
                type: String,
              },
              variationTypeId: {
                type: String,
              },
            },
          ],
          ref: "variation",
        },
        productPrice: {
          type: Number,
          // Base price of the product variation:
          // - For non-customized products: this is the standard variation price.
          // - For customized products: this is the custom product price excluding any diamond-related pricing.
        },
        unitAmount: {
          type: Number,
          // Final total price after multiplying with quantity:
          // - For non-customized products: productPrice * quantity.
          // - For customized products: (productPrice + diamond price) * quantity.
        },
        returnQuantity: {
          // Quantity specifically for this return request
          type: Number,
        },
        diamondDetail: {
          // New field for customized products
          type: {
            shapeId: {
              type: String,
            },
            caratWeight: {
              type: Number,
            },
            clarity: {
              type: String,
            },
            color: {
              type: String,
            },
            price: {
              type: Number, // Diamond price
            },
          },
          required: false, // Optional for non-customized products
        },
      },
    ],
    required: true,
    ref: "products",
  },
  returnRequestReason: {
    type: String,
  },
  cancelReason: {
    type: String,
  },
  adminNote: {
    type: String,
  },
  refundDescription: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "cancelled", "approved", "rejected", "received"],
    default: "pending",
  },
  shippingLabel: {
    type: String, // pdf for label
  },
  returnPaymentStatus: {
    type: String,
    enum: [
      "pending",
      "pending_refund",
      "refund_initialization_failed",
      "failed_refund",
      "cancelled_refund",
      "refunded",
    ],
  },
  refundAmount: {
    type: Number,
    required: true,
  },
  stripeRefundId: {
    type: String,
  },
  stripeRefundFailureReason: {
    type: String,
  },
  stripeARNNumber: {
    type: String,
    default: "",
  },
  paypalRefundId: {
    type: String,
  },
  paypalRefundFailureReason: {
    type: String,
  },
};
