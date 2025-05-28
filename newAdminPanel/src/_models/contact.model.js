export const contactModel = {
  createdDate: Date,
  updatedDate: Date,
  id: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: Number,
  },
  requirement: {
    type: String,
  },
};
