"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./layout/header.jsx"), {
  ssr: true,
});

export const HeaderLinkButton = dynamic(
  () => import("./ui/button.jsx").then((mod) => mod.HeaderLinkButton),
  { ssr: true }
);

export const Footer = dynamic(() => import("./layout/footer.jsx"), {
  ssr: true,
});

export const ProfileHeader = dynamic(
  () => import("./layout/profile/header.jsx"),
  {
    ssr: true,
  }
);

export const ProgressiveImg = dynamic(() => import("./ui/progressive-img"), {
  ssr: false,
});

export const CustomImg = dynamic(() => import("./ui/custom-img"));

export const Lenis = dynamic(() => import("./layout/lenis"), { ssr: false });
export const StoreProvider = dynamic(() => import("@/store/provider"), {
  ssr: false,
});

export const NavigationHeader = dynamic(
  () => import("./layout/navigationHeader"),
  {
    ssr: true,
  }
);

export const ProfileNavigationHeader = dynamic(
  () => import("./layout/profile/navigationHeader.jsx"),
  {
    ssr: true,
  }
);

export const ProductGrid = dynamic(() => import("./shop/productGrid"), {
  ssr: false,
});

export const AnimatedSection = dynamic(() => import("./ui/AnimatedSection"), {
  ssr: false,
});

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

export const ProductFilter = dynamic(() => import("./shop/productFilter.jsx"), {
  ssr: false,
});
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
  ssr: true,
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
  () => import("./ui/customize/select-setting/page.jsx"),
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
export const CustomTabs = dynamic(() => import("./ui/CustomTabs.jsx"), {
  ssr: false,
});
export const CustomJewelryPage = dynamic(
  () => import("./ui/CustomJewelry.jsx"),
  {
    ssr: false,
  }
);
export const FileUpload = dynamic(() => import("./ui/FileUpload.jsx"), {
  ssr: false,
});

export const ContactForm = dynamic(() => import("./ui/ContactForm.jsx"), {
  ssr: false,
});

export const ReviewSlider = dynamic(() => import("./ui/ReviewSlider.jsx"), {
  ssr: false,
});

export const GetToKnowUsSection = dynamic(
  () => import("./ui/home/GetToKnowUsSection.jsx"),
  {
    ssr: false,
  }
);
export const SearchBar = dynamic(() => import("./ui/SearchBar.jsx"), {
  ssr: false,
});

export const ProductDetailPageImage = dynamic(
  () => import("./ui/ProductDetailPageImage.jsx"),
  {
    ssr: false,
  }
);

export const AccordionTabs = dynamic(() => import("./ui/AccordianTabs.jsx"), {
  ssr: false,
});

export const CustomJewelryDetailPage = dynamic(
  () => import("./ui/CustomJewelryDetailPage.jsx"),
  {
    ssr: false,
  }
);

export const DiamondInfoModel = dynamic(
  () => import("./ui/customize/DiamondInfoModel.jsx"),
  {
    ssr: false,
  }
);

export const ProfileDetailPage = dynamic(
  () => import("./ui/ProfileDetailPage.jsx"),
  {
    ssr: false,
  }
);

export const CenterFocusSlider = dynamic(
  () => import("./ui/CenterFocusSlider.jsx"),
  {
    ssr: false,
  }
);

export const RingSettingCenterStone = dynamic(
  () => import("./ui/RingSettingCenterStone.jsx"),
  {
    ssr: false,
  }
);

export const JewelryAppointment = dynamic(
  () => import("./ui/JewelryAppointment.jsx"),
  {
    ssr: false,
  }
);

export const HomePagePopup = dynamic(() => import("./ui/HomePagePopup.jsx"), {
  ssr: false,
});

export const HomePagePopupWithLogin = dynamic(
  () => import("./ui/HomePagePopupWithLogin.jsx"),
  {
    ssr: false,
  }
);

export const CartIconInCheckout = dynamic(
  () => import("./ui/CartIconInCheckout.jsx"),
  {
    ssr: false,
  }
);

export const CartPopup = dynamic(() => import("./ui/CartPopup.jsx"), {
  ssr: false,
});

export const EllipsisLoader = dynamic(() => import("./ui/EllipsisLoader.jsx"), {
  ssr: false,
});

export const HeroBanner = dynamic(() => import("./ui/HeroBanner.jsx"), {
  ssr: false,
});

export const OrderDetailPage = dynamic(
  () => import("./ui/order-history/OrderDetailPage.jsx"),
  {
    ssr: false,
  }
);

export const OrderHistoryPage = dynamic(
  () => import("./ui/order-history/OrderHistoryPage.jsx"),
  {
    ssr: false,
  }
);

export const SubscribeEmail = dynamic(() => import("./ui/SubscribeEmail.jsx"), {
  ssr: false,
});

export const TrackYourOrderPage = dynamic(
  () => import("./ui/order/TrackYourOrderPage.jsx"),
  {
    ssr: false,
  }
);

export const TrackYourReturnPage = dynamic(
  () => import("./ui/return/TrackYourReturnPage.jsx"),
  {
    ssr: false,
  }
);

export const ProfileDropdown = dynamic(
  () => import("./ui/ProfileDropdown.jsx"),
  {
    ssr: false,
  }
);

export const Spinner = dynamic(() => import("./ui/spinner.jsx"), {
  ssr: false,
});
