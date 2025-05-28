import { ALLOW_MAX_CARAT_WEIGHT, ALLOW_MIN_CARAT_WEIGHT } from 'src/_helpers/constants';

export const productModel = {
  id: {
    type: String,
    unique: true,
  },
  productName: {
    type: String,
    unique: true,
  },
  thumbnailImage: {
    type: String,
    required: true,
  },
  images: {
    type: [
      {
        image: {
          type: String,
          require: true,
        },
      },
    ],
  },
  video: {
    type: String,
  },
  sku: {
    type: String,
    require: true,
    unique: true,
  },
  saltSKU: {
    type: String,
    require: true,
    unique: true,
  },
  discount: {
    type: Number, // in percentage
  },
  collectionIds: {
    type: Array,
    ref: 'collection',
  },
  settingStyleIds: {
    type: Array,
    ref: 'settingStyle',
  },
  categoryId: {
    type: String,
    ref: 'categories',
    require: true,
  },
  subCategoryId: {
    type: String,
    ref: 'subCategories',
    // require: true,
  },
  productTypeIds: {
    type: Array,
    ref: 'productType',
    // require: true,
  },
  netWeight: {
    type: Number,
  },
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
    require: true,
  },
  variations: {
    type: [
      {
        variationId: {
          type: String,
          require: true,
        },
        variationTypes: {
          type: [
            {
              variationTypeId: {
                type: String,
                require: true,
              },
            },
          ],
        },
      },
    ],
  },
  variComboWithQuantity: {
    type: [
      {
        combination: {
          type: [
            {
              variationId: {
                type: String,
                require: true,
              },
              variationTypeId: {
                type: String,
                require: true,
              },
            },
          ],
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  isDiamondFilter: {
    type: Boolean,
    default: false,
  },
  diamondFilters: {
    // api Response Field Name ==> shape
    diamondShapeIds: {
      type: [String],
      default: [],
    },
    // api Response Field Name ==> size
    caratWeightRange: {
      min: { type: Number, default: ALLOW_MIN_CARAT_WEIGHT },
      max: { type: Number, default: ALLOW_MAX_CARAT_WEIGHT },
    },
  },
  specifications: {
    type: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  active: {
    type: Boolean,
    require: true,
    default: true,
  },
  salesTaxPercentage: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  starRating: {
    type: Number,
    default: 0,
  },
  totalStar: {
    type: Number,
    default: 0,
  },
  createdDate: Date,
  updatedDate: Date,
};
