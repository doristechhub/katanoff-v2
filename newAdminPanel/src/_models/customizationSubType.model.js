export const customizationSubTypeModel = {
  createdDate: Date,
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    unique: true,
  },
  customizationTypeId: {
    type: String,
    ref: 'customizationType',
  },
  type: {
    type: String,
    enum: ['default', 'color', 'image'],
  },
  hexCode: {
    type: String,
  },
  image: {
    type: String,
  },
  unit: {
    type: String,
    enum: ['gram', 'carat'],
  },
  price: {
    type: Number,
  },
};
