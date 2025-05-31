export const cartModel = {
  id: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    ref: "user",
  },
  productId: {
    type: String,
    ref: "products",
  },
  quantity: {
    type: Number,
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
    },
    required: false, // Optional for non-customized products
  },
  createdDate: Date,
  updatedDate: Date,
};
