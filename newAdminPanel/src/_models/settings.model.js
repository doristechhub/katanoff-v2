export const settingsModel = {
  nonCustomizedProducts: {
    priceMultiplier: {
      type: Number,
      required: true,
      default: 1.0,
    },
  },
  customizedProducts: {
    customProductPriceMultiplier: {
      type: Number,
      required: true,
      default: 1,
    },
    sideDiamondPricePerCarat: {
      type: Number,
      required: true,
      default: 0,
    },
    metalPricePerGram: {
      type: Number,
      required: true,
      default: 0,
    },
    // Diamond color options with associated pricing
    diamondColors: {
      type: [
        {
          id: {
            type: String,
            unique: true,
            required: true,
          },
          compatibleOptions: {
            type: [String],
            required: true, // List of compatible clarities
          },
          pricePerCarat: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      required: true,
    },
    // Diamond clarity options with associated pricing
    diamondClarities: {
      type: [
        {
          id: {
            type: String,
            unique: true,
            required: true,
          },
          compatibleOptions: {
            type: [String],
            required: true, // List of compatible colors
          },
          pricePerCarat: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      required: true,
    },
    // Carat range options with associated pricing
    caratRanges: {
      type: [
        {
          id: {
            type: String,
            unique: true,
            required: true,
          },
          minCarat: {
            type: Number,
            required: true,
            min: 0, // Ensure non-negative carat values
          },
          maxCarat: {
            type: Number,
            required: true,
            min: 0,
          },
          pricePerCarat: {
            type: Number,
            required: true,
            default: 0,
          },
        },
      ],
      required: true,
    },
  },
};
