export const menuCategoryModel = {
  createdDate: Date,
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
  },
  position: {
    type: Number, // Add a new field for display position
    unique: true, // Ensure the order is unique to avoid duplicates
  },
};
