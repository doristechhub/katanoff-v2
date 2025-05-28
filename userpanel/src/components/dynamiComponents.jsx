"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./layout/header.jsx"), {
  ssr: false,
});
export const Footer = dynamic(() => import("./layout/footer.jsx"), {
  ssr: false,
});

export const ProfileHeader = dynamic(
  () => import("./layout/profile/header.jsx"),
  {
    ssr: false,
  }
);

export const ProgressiveImg = dynamic(() => import("./ui/progressive-img"), {
  ssr: false,
});

export const CustomImg = dynamic(() => import("./ui/custom-img"), {
  ssr: false,
});

export const Lenis = dynamic(() => import("./layout/lenis"), { ssr: false });
export const StoreProvider = dynamic(() => import("@/store/provider"), {
  ssr: false,
});

export const NavigationHeader = dynamic(
  () => import("./layout/navigationHeader"),
  {
    ssr: false,
  }
);

export const ProfileNavigationHeader = dynamic(
  () => import("./layout/profile/navigationHeader.jsx"),
  {
    ssr: false,
  }
);

export const ProductGrid = dynamic(() => import("./shop/productGrid"), {
  ssr: false,
});

export const AnimatedSection = dynamic(() => import("./ui/AnimatedSection"), {
  ssr: false,
});

export const SwipperHomePageBig = dynamic(
  () => import("./ui/SwipperHomePageBig.jsx"),
  {
    ssr: false,
  }
);

export const TestimonialSlider = dynamic(
  () => import("./ui/TestimonialSlider.jsx"),
  {
    ssr: false,
  }
);

export const AccordionDropdown = dynamic(
  () => import("./ui/AccordionDropdown"),
  {
    ssr: false,
  }
);

export const ProductSwiper = dynamic(() => import("./shop/productSwiper.jsx"), {
  ssr: false,
});

export const ProductFilterSidebar = dynamic(
  () => import("./shop/productFilterSidebar"),
  {
    ssr: false,
  }
);
export const LoginForm = dynamic(() => import("./auth/LoginForm.jsx"), {
  ssr: false,
});
export const SignUpForm = dynamic(() => import("./auth/SignUpForm.jsx"), {
  ssr: false,
});
export const VerifyOTPForm = dynamic(() => import("./auth/VerifyOTPForm.jsx"), {
  ssr: false,
});
export const CheckoutCommonComponent = dynamic(
  () => import("./ui/checkout/CheckoutCommonComponent.jsx"),
  {
    ssr: false,
  }
);

export const CartPage = dynamic(() => import("./ui/cart/CartPage.jsx"), {
  ssr: false,
});

export const LatestProduct = dynamic(() => import("./ui/LatestProduct.jsx"), {
  ssr: false,
});

export const CheckoutForm = dynamic(
  () => import("./ui/checkout/CheckoutForm.jsx"),
  {
    ssr: false,
  }
);
export const AddressVerificationModal = dynamic(
  () => import("./ui/checkout/AddressVerificationModal.jsx"),
  {
    ssr: false,
  }
);

export const ShippingForm = dynamic(
  () => import("./ui/shipping/ShippingForm.jsx"),
  {
    ssr: false,
  }
);
export const HomePage = dynamic(() => import("./ui/home/HomePage.jsx"), {
  ssr: false,
});
export const CheckoutPage = dynamic(
  () => import("./ui/checkout/CheckoutPage.jsx"),
  {
    ssr: false,
  }
);
export const CollectionPage = dynamic(() => import("./ui/CollectionPage.jsx"), {
  ssr: false,
});

export const ShippingPage = dynamic(
  () => import("./ui/shipping/ShippingPage.jsx"),
  {
    ssr: false,
  }
);
export const NotFoundPage = dynamic(() => import("./ui/NotFoundPage.jsx"), {
  ssr: false,
});

export const OrderSuccessfulPage = dynamic(
  () => import("./ui/order/OrderSuccessfulPage.jsx"),
  {
    ssr: false,
  }
);

export const ProductDetailSwipperSm = dynamic(
  () => import("./shop/ProductDetailSwipperSm.jsx"),
  {
    ssr: false,
  }
);

export const ProgressiveVed = dynamic(
  () => import("./ui/progressive-ved.jsx"),
  {
    ssr: false,
  }
);

export const CustomVideo = dynamic(() => import("./ui/custom-video.jsx"), {
  ssr: false,
});

export const CartNotFound = dynamic(
  () => import("./ui/cart/CartNotFound.jsx"),
  {
    ssr: false,
  }
);

export const Layout = dynamic(() => import("./layout/Layout.jsx"), {
  ssr: false,
});

export const PaymentPage = dynamic(
  () => import("./ui/payment/PaymentPage.jsx"),
  {
    ssr: false,
  }
);

export const AddressSummary = dynamic(() => import("./ui/AddressSummary.jsx"), {
  ssr: false,
});

export const PaymentForm = dynamic(
  () => import("./ui/payment/PaymentForm.jsx"),
  {
    ssr: false,
  }
);
export const PaypalForm = dynamic(() => import("./ui/payment/PaypalForm.jsx"), {
  ssr: false,
});

export const HeroSwiper = dynamic(() => import("./ui/HeroSwiper.jsx"), {
  ssr: false,
});

export const CompleteRingPage = dynamic(
  () => import("./ui/customize/complete-ring/page.jsx"),
  {
    ssr: false,
  }
);

export const StartWithSettingDetailpage = dynamic(
  () =>
    import("./ui/customize/start-with-setting/StartWithSettingDetailpage.jsx"),
  {
    ssr: false,
  }
);

export const ProductDetailPage = dynamic(
  () => import("./ui/product/ProductDetailPage.jsx"),
  {
    ssr: false,
  }
);

export const SelectDiamondPage = dynamic(
  () => import("./ui/customize/select-diamond/page.jsx"),
  {
    ssr: false,
  }
);

export const StartWithSettingPage = dynamic(
  () => import("./ui/customize/start-with-setting/page.jsx"),
  {
    ssr: false,
  }
);

export const OrderSummary = dynamic(
  () => import("./ui/order-history/OrderSummary.jsx"),
  {
    ssr: false,
  }
);

export const ProductNotFound = dynamic(
  () => import("./ui/product/ProductNotFound.jsx"),
  {
    ssr: false,
  }
);

export const ReturnRequestPage = dynamic(
  () => import("./ui/return/ReturnRequestPage.jsx"),
  {
    ssr: false,
  }
);
export const SearchProductPage = dynamic(
  () => import("./ui/SearchProductPage.jsx"),
  {
    ssr: false,
  }
);

export const ReturnHistoryPage = dynamic(
  () => import("./ui/return/ReturnHistoryPage.jsx"),
  {
    ssr: false,
  }
);

export const ReturnDetails = dynamic(
  () => import("./ui/return/ReturnDetails.jsx"),
  {
    ssr: false,
  }
);

export const RangeSlider = dynamic(() => import("./ui/RangeSlider.jsx"), {
  ssr: false,
});

export const AppointmentCustomJewelryPage = dynamic(
  () => import("./ui/AppointmentCustomJewelryPage.jsx"),
  {
    ssr: false,
  }
);
export const CustomJewelryForm = dynamic(
  () => import("./ui/CustomJewelryForm.jsx"),
  {
    ssr: false,
  }
);
export const AppointmentForm = dynamic(
  () => import("./ui/AppointmentForm.jsx"),
  {
    ssr: false,
  }
);
export const CustomTabs = dynamic(
  () => import("./ui/CustomTabs.jsx"),
  {
    ssr: false,
  }
);
export const CustomJewelryPage = dynamic(
  () => import("./ui/CustomJewelry.jsx"),
  {
    ssr: false,
  }
);
export const FileUpload = dynamic(
  () => import("./ui/FileUpload.jsx"),
  {
    ssr: false,
  }
);

export const ContactForm = dynamic(
  () => import("./ui/ContactForm.jsx"),
  {
    ssr: false,
  }
);