export const addressesModel = {
  userId: {
    type: String,
    ref: "user",
    required: "userId  required",
  },
  country: {
    type: String,
    required: [true, "country is required"],
  },
  firstName: {
    type: String,
    required: [true, "firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required"],
  },
  company: {
    type: String,
  },
  address: {
    type: String,
    required: [true, "address is required"],
  },
  apartment: {
    type: String,
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
  state: {
    type: String,
    required: [true, "state is required"],
  },
  pinCode: {
    type: Number,
    default: [true, "pinCode is required"],
  },
  mobile: {
    type: Number,
    required: [true, "mobile number is required"],
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
};
