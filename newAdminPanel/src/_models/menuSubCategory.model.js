export const menuSubCategoryModel = {
  createdDate: Date,
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
  },
  categoryId: {
    type: String,
    ref: 'MenuCategory', // Reference to menuCategoryModel
  },
  position: {
    type: Number,
    unique: true, // position set categoryId wise
  },
  desktopBannerImage: {
    type: String, // 1920*448
  },
  mobileBannerImage: {
    type: String, // 1500*738
  },
};
