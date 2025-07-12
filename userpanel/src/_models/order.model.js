export const orderModel = {
  id: {
    type: String,
    unique: true,
    require: true,
  },
  orderNumber: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    ref: "user",
  },
  stripeCustomerId: {
    type: String,
  },
  stripePaymentIntentId: {
    type: String,
  },
  stripeRefundId: {
    type: String,
  },
  stripeRefundFailureReason: {
    type: String,
  },
  paypalOrderId: {
    type: String, // Store PayPal order ID
  },
  paypalCaptureId: {
    type: String, // Store PayPal capture ID for refund
  },
  paypalRefundId: {
    type: String, // Store PayPal refund ID
  },
  paypalRefundFailureReason: {
    type: String, // Store reason for PayPal refund failure
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
          // - For customized products: this is the custom product price using formula.
        },
        unitAmount: {
          type: Number,
          // Final total price after multiplying with quantity:
          // - For customized and non-customized products: productPrice * quantity.
        },
        cartQuantity: {
          type: Number,
        },
        diamondDetail: {
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
          },
          required: false, // Optional for non-customized products
        },
      },
    ],
    require: true,
    ref: "products",
  },
  shippingAddress: {
    type: {
      email: {
        type: String,
      },
      name: {
        type: String,
      },
      country: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      stateCode: {
        type: String,
      },
      pinCode: {
        type: Number,
      },
      address: {
        type: String,
      },
      mobile: {
        type: Number,
      },
      company: {
        type: String,
      },
      apartment: {
        type: String,
      },
    },
    require: true,
  },
  billingAddress: {
    type: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postal_code: {
        type: String,
        required: true,
      },
    },
    require: false,
  },
  paymentMethodDetails: {
    type: {
      type: {
        type: String,
        enum: [
          "card",
          "klarna",
          "affirm",
          "amazon_pay",
          "link",
          "us_bank_account",
        ], // more...
      },
      brand: {
        type: String,
      },
      lastFour: {
        type: String,
      },
      funding: {
        type: String,
        enum: ["credit", "debit", "prepaid"],
      },
    },
    require: false,
  },
  subTotal: {
    // wihtout shipping,discount and other taxes
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  salesTax: {
    // calculate sales tax based on subtotal - discount
    type: Number,
    default: 0,
  },
  salesTaxPercentage: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    require: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  trackingNumber: {
    type: String,
  },
  deliveryDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "success",
      "failed",
      "refunded",
      "pending_refund",
      "failed_refund",
      "cancelled_refund",
      "refund_initialization_failed",
    ],
  },
  paymentMethod: {
    type: String,
    enum: ["stripe", "paypal"],
  },
  cancelReason: {
    type: String,
    default: "",
  },
  refundDescription: {
    type: String,
    default: "",
  },
  stripeARNNumber: {
    type: String,
    default: "",
  },
  cancelledBy: {
    type: String,
    ref: "user",
  },
  returnRequestIds: {
    type: [String],
    ref: "returnRequest",
  },
  promoCode: {
    type: String,
    default: "",
  },
  createdDate: Date,
  updatedDate: Date,
};
