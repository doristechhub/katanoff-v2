export const collectionModel = {
  createdDate: Date,
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
  },
  desktopBannerImage: {
    type: String, // 1920*448
  },
  mobileBannerImage: {
    type: String, // 1500*738
  },
};
