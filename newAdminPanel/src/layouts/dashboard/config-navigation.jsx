import AppsTwoToneIcon from '@mui/icons-material/AppsTwoTone';
import DiamondTwoToneIcon from '@mui/icons-material/DiamondTwoTone';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import SlideshowTwoToneIcon from '@mui/icons-material/SlideshowTwoTone';
import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
import LocalMallTwoToneIcon from '@mui/icons-material/LocalMallTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import RateReviewTwoToneIcon from '@mui/icons-material/RateReviewTwoTone';
import BookOnlineTwoToneIcon from '@mui/icons-material/BookOnlineTwoTone';
import Diversity3TwoToneIcon from '@mui/icons-material/Diversity3TwoTone';
import AutoAwesomeTwoToneIcon from '@mui/icons-material/AutoAwesomeTwoTone';
import InsertEmoticonTwoToneIcon from '@mui/icons-material/InsertEmoticonTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import PentagonTwoToneIcon from '@mui/icons-material/PentagonTwoTone';
import DiscountIcon from '@mui/icons-material/Discount';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsTwoToneIcon from '@mui/icons-material/InsightsTwoTone';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    pageId: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
    children: [],
    actions: [],
  },
  {
    title: 'product',
    pageId: 'product',
    path: '/product',
    icon: icon('ic_cart'),
    children: ['/product', '/product/add', '/product/import-from-excel-first'],
    actions: [
      { label: 'Add Product', value: 'add' },
      { label: 'Update Product', value: 'update' },
      { label: 'Delete Product', value: 'delete' },
      { label: 'Import Product', value: 'import' },
      { label: 'Export Product', value: 'export' },
    ],
  },
  // {
  //   title: 'brand',
  //   pageId: 'slider',
  //   path: '/brand',
  //   icon: <CategoryTwoToneIcon />,
  //   children: [],
  // },
  {
    title: 'menu',
    pageId: 'menu',
    path: '/menu',
    icon: <SummarizeTwoToneIcon />,
    children: ['/menu/category', '/menu/subcategory', '/menu/productType'],
    actions: [],
  },
  {
    title: 'collection',
    pageId: 'collection',
    path: '/collection',
    icon: <AppsTwoToneIcon />,
    children: ['/collection', '/collection/add'],
    actions: [],
  },
  {
    title: 'Setting Style',
    pageId: 'settingStyle',
    path: '/settingStyle',
    icon: <Inventory2TwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'Diamond Shape',
    pageId: 'diamondShape',
    path: '/diamondShape',
    icon: <PentagonTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'customization',
    pageId: 'customization',
    path: '/customization',
    icon: <AutoAwesomeTwoToneIcon />,
    children: ['/customization', '/customization/type', '/customization/subtype'],
    actions: [],
  },
  {
    title: 'Discounts',
    pageId: 'discounts',
    path: '/discounts',
    icon: <DiscountIcon />,
    children: ['/discounts', '/discounts/add'],
    actions: [],
  },
  // {
  //   title: 'showcase banner',
  //   pageId: 'showcasebanner',
  //   path: '/showcase-banner',
  //   icon: <SlideshowTwoToneIcon />,
  //   children: [],
  // },
  {
    title: 'Setting',
    pageId: 'settings',
    path: '/settings',
    icon: <SettingsIcon />,
    children: ['/settings'],
    actions: [],
  },
  {
    title: 'order',
    pageId: 'orders',
    path: '/orders',
    icon: <LocalMallTwoToneIcon />,
    children: ['/orders', '/orders/list', '/orders/refund'],
    actions: [],
  },
  {
    title: 'returns',
    pageId: 'returns',
    path: '/returns',
    icon: <Iconify icon="ic:twotone-assignment-return" width={25} />,
    children: ['/returns', '/returns/list', '/returns/refund', '/returns/return-detail'],
    actions: [],
  },
  {
    title: 'appointment',
    pageId: 'appointments',
    path: '/appointment',
    icon: <BookOnlineTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'custom jewelry',
    pageId: 'customJewelry',
    path: '/custom-jewelry',
    icon: <DiamondTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'review',
    pageId: 'review',
    path: '/review',
    icon: <RateReviewTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'user',
    pageId: 'users',
    path: '/user',
    icon: <InsertEmoticonTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'subscribers',
    pageId: 'subscribers',
    path: '/subscribers',
    icon: <Diversity3TwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'contacts',
    pageId: 'contacts',
    path: '/contacts',
    icon: <Iconify icon="ic:twotone-contact-page" width={25} />,
    children: [],
    actions: [],
  },
  {
    title: 'permissions',
    pageId: 'permissions',
    path: '/permissions',
    icon: icon('ic_lock'),
    children: [],
    actions: [],
  },
  {
    title: 'report & analysis',
    pageId: 'report & analysis',
    path: '/report-analysis',
    icon: <AssessmentTwoToneIcon />,
    children: [],
    actions: [],
  },
  {
    title: 'Website Analytics',
    pageId: 'website-analytics',
    path: '/website-analytics',
    icon: <InsightsTwoToneIcon />,
    children: [],
    actions: [],
  },
];

export default navConfig;
