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
  // New fields for Rose Gold media
  roseGoldThumbnailImage: {
    type: String,
    required: true,
  },
  roseGoldImages: {
    type: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  roseGoldVideo: {
    type: String,
  },
  // New fields for Yellow Gold media
  yellowGoldThumbnailImage: {
    type: String,
    required: true,
  },
  yellowGoldImages: {
    type: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  yellowGoldVideo: {
    type: String,
  },
  // New fields for White Gold media
  whiteGoldThumbnailImage: {
    type: String,
    required: true,
  },
  whiteGoldImages: {
    type: [
      {
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  whiteGoldVideo: {
    type: String,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  saltSKU: {
    type: String,
    required: true,
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
    required: true,
  },
  subCategoryIds: {
    type: Array,
    ref: 'subCategories',
    // required: true,
  },
  productTypeIds: {
    type: Array,
    ref: 'productType',
    // required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unisex'],
  },
  netWeight: {
    type: Number, // in gram
  },
  grossWeight: {
    type: Number, // in gram
    required: true,
  },
  centerDiamondWeight: {
    type: Number, // in carat
  },
  totalCaratWeight: {
    type: Number, // in carat
    required: true,
  },
  sideDiamondWeight: {
    type: Number, // in carat
  },
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  variations: {
    type: [
      {
        variationId: {
          type: String,
          required: true,
        },
        position: {
          type: number,
          required: false,
        },
        variationTypes: {
          type: [
            {
              variationTypeId: {
                type: String,
                required: true,
              },
              position: {
                type: number,
                required: false, // reset position variation type wise
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
                required: true,
              },
              variationTypeId: {
                type: String,
                required: true,
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
    diamondShapeIds: {
      type: [String],
      default: [],
    },
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
  priceCalculationMode: {
    type: String,
    default: 'automatic',
    enum: ['automatic', 'manual'],
  },
  active: {
    type: Boolean,
    required: true,
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
