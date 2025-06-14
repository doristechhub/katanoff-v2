export const topSellingDurationButtonsList = [
  { name: 'All', value: 'all' },
  { name: '1W', value: '1W' },
  { name: '1M', value: '1M' },
  { name: '3M', value: '3M' },
  { name: '6M', value: '6M' },
  { name: '1Y', value: '1Y' },
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

export const RING_SIZE = { title: 'Ring Size' };

export const GOLD_TYPE_SUB_TYPES_LIST = [
  { title: '10K', type: 'default' },
  { title: '14K', type: 'default' },
  { title: '18K', type: 'default' },
];

export const GOLD_COLOR_SUB_TYPES_LIST = [
  { title: 'Yellow Gold', type: 'color', hexCode: '#E5CE83' },
  { title: 'White Gold', type: 'color', hexCode: '#E5E4E2' },
  { title: 'Rose Gold', type: 'color', hexCode: '#E7BA9A' },
];

export const INIT_GOLD_TYPE_SUB_TYPES_LIST = [
  // { title: '10K', type: 'default' },
  { title: '14K', type: 'default' },
];

// Object map for gold color to thumbnail field
export const GOLD_COLOR_MAP = {
  'rose gold': 'roseGoldThumbnailImage',
  'yellow gold': 'yellowGoldThumbnailImage',
  'white gold': 'whiteGoldThumbnailImage',
};

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
