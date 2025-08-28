export const collectionModel = {
  createdDate: Date,
  updatedDate: Date,
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
  },
  type: {
    type: String,
    enum: [null, 'slider_grid', 'two_grid', 'three_grid'],
  },
  filterType: {
    type: String,
    enum: ['setting_style', 'sub_categories', 'product_types'],
    default: 'setting_style', // Default for new and existing records
  },
  position: {
    type: Number,
    unique: true, // position set type wise
  },
  desktopBannerImage: {
    type: String, // 1920*448
  },
  mobileBannerImage: {
    type: String, // 1500*738
  },
  thumbnailImage: {
    type: String, // slider_grid: 402*502, two_grid: 825*784, three_grid: 544*472
  },
};
