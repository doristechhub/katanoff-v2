export const customJewelryModel = {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  image: {
    type: String,
    required: [true, "image is required"],
  },
};