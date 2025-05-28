export const userModel = {
  id: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  createdDate: Date,
  updatedDate: Date,
};
