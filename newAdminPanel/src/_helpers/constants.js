export const topSellingDurationButtonsList = [
  { name: 'All', value: 'all' },
  { name: '1W', value: '1W' },
  { name: '1M', value: '1M' },
  { name: '3M', value: '3M' },
  { name: '6M', value: '6M' },
  { name: '1Y', value: '1Y' },
];

export const topSellingLimitList = [
  { label: 'all', value: 0 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

export const productStatusOptions = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Active',
    value: true,
  },
  {
    label: 'Inactive',
    value: false,
  },
];

export const perPageCountOptions = [
  {
    label: '4',
    value: 4,
  },
  {
    label: '12',
    value: 12,
  },
  {
    label: '24',
    value: 24,
  },
  {
    label: '48',
    value: 48,
  },
];

export const GOLD_TYPE = { title: 'Gold Type' };

export const GOLD_COLOR = { title: 'Gold Color' };

export const SIZE_TYPE = { title: 'Size' };

export const GOLD_TYPE_SUB_TYPES_LIST = [
  { title: '10K', type: 'default' },
  { title: '14K', type: 'default' },
  { title: '18K', type: 'default' },
];

export const INIT_GOLD_TYPE_SUB_TYPES_LIST = [
  { title: '10K', type: 'default' },
  { title: '14K', type: 'default' },
];

export const SIZE_TYPE_SUB_TYPES_LIST = [
  { title: '6', type: 'default' },
  { title: '7', type: 'default' },
  { title: '8', type: 'default' },
  { title: '9', type: 'default' },
  { title: '10', type: 'default' },
  { title: '11', type: 'default' },
  { title: '12', type: 'default' },
  { title: '13', type: 'default' },
  { title: '14', type: 'default' },
];

// export const GOLD_COLOR_SUB_TYPES_LIST = [
//   { title: 'Yellow', type: 'color', hexCode: '#eeae3f' },
//   { title: 'White', type: 'color', hexCode: '#b3b2af' },
//   { title: 'Rose', type: 'color', hexCode: '#e5785d' },
// ];

export const GOLD_COLOR_SUB_TYPES_LIST = [
  { title: 'Yellow Gold', type: 'color', hexCode: '#E5CE83' },
  { title: 'White Gold', type: 'color', hexCode: '#E5E4E2' },
  { title: 'Rose Gold', type: 'color', hexCode: '#E7BA9A' },
];

// Object map for gold color to thumbnail field
export const GOLD_COLOR_MAP = {
  'rose gold': 'roseGoldThumbnailImage',
  'yellow gold': 'yellowGoldThumbnailImage',
  'white gold': 'whiteGoldThumbnailImage',
};

export const ALLOWED_DIA_TYPES = [
  {
    title: 'Natural',
    value: 'natural_diamond',
  },
  {
    title: 'Lab Grouwn',
    value: 'lab_grown_diamond',
  },
];

export const ALLOWED_SHAPES = [
  {
    title: 'Round',
    value: 'Round',
  },
  {
    title: 'Oval',
    value: 'Oval',
  },
  {
    title: 'Emerald',
    value: 'Emerald',
  },
  {
    title: 'Cushion',
    value: 'Cushion',
  },
  {
    title: 'Pear',
    value: 'Pear',
  },
  {
    title: 'Radiant',
    value: 'Radiant',
  },
  {
    title: 'Princess',
    value: 'Princess',
  },
  {
    title: 'Marquise',
    value: 'Marquise',
  },
  {
    title: 'Asscher',
    value: 'Asscher',
  },
  {
    title: 'Heart',
    value: 'Heart',
  },
];

export const ALLOWED_DIA_CUTS = [
  {
    title: 'Fair',
    value: 'Fair',
  },
  {
    title: 'Good',
    value: 'Good',
  },
  {
    title: 'Very Good',
    value: 'Very Good',
  },
  {
    title: 'Ideal',
    value: 'Ideal',
  },
  {
    title: 'Super Ideal',
    value: 'Super Ideal',
  },
];

export const ALLOWED_DIA_COLORS = [
  {
    title: 'J - Near Colorless',
    value: 'J',
  },
  {
    title: 'I - Near Colorless',
    value: 'I',
  },
  {
    title: 'H - Near Colorless',
    value: 'H',
  },
  {
    title: 'G - Near Colorless',
    value: 'G',
  },
  {
    title: 'F - Colorless',
    value: 'F',
  },
  {
    title: 'E - Colorless',
    value: 'E',
  },
  {
    title: 'D - Colorless',
    value: 'D',
  },
];

export const ALLOWED_DIA_CLARITIES = [
  {
    title: 'Slightly Included (SI2)',
    value: 'SI2',
  },
  {
    title: 'Slightly Included (SI1)',
    value: 'SI1',
  },
  {
    title: 'Very Slightly Included (VS2)',
    value: 'VS2',
  },
  {
    title: 'Very Slightly Included (VS1)',
    value: 'VS1',
  },
  {
    title: 'Very, Very Slightly Included (VVS2)',
    value: 'VVS2',
  },
  {
    title: 'Very, Very Slightly Included (VVS1)',
    value: 'VVS1',
  },
  {
    title: 'Internally Flawless (IF)',
    value: 'IF',
  },
  {
    title: 'Flawless (FL)',
    value: 'FL',
  },
];

export const ALLOWED_DIA_FLUORESCENCE = [
  {
    title: 'Very Strong',
    value: 'Very Strong',
  },
  {
    title: 'Strong',
    value: 'Strong',
  },
  {
    title: 'Medium',
    value: 'Medium',
  },
  {
    title: 'Faint',
    value: 'Faint',
  },
  {
    title: 'None',
    value: 'None',
  },
];

export const ALLOWED_DIA_POLISH = [
  {
    title: 'Good',
    value: 'Good',
  },
  {
    title: 'Very Good',
    value: 'Very Good',
  },
  {
    title: 'Excellent',
    value: 'Excellent',
  },
];

export const ALLOWED_DIA_SYMMETRIES = [
  {
    title: 'Good',
    value: 'Good',
  },
  {
    title: 'Very Good',
    value: 'Very Good',
  },
  {
    title: 'Excellent',
    value: 'Excellent',
  },
];

export const ALLOWED_DIA_CERTIFICATES = [
  {
    title: 'IGI',
    value: 'IGI',
  },
  {
    title: 'GIA',
    value: 'GIA',
  },
  {
    title: 'HRD',
    value: 'HRD',
  },
];

export const ALLOW_MIN_CARAT_WEIGHT = 1.5;
export const ALLOW_MAX_CARAT_WEIGHT = 7;

export const GENDER_LIST = [
  {
    title: 'Male',
    value: 'male',
  },
  {
    title: 'Female',
    value: 'female',
  },
  {
    title: 'Unisex',
    value: 'unisex',
  },
];
