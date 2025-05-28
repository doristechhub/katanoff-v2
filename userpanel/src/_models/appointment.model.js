export const appointmentModel = {
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  dateTime: {
    type: String,
    required: [true, "date is required"],
  },
  reason: {
    type: String,
    required: [true, "reason is required"],
  },
  appointmentStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
};
