import { META_CONSTANTS, WebsiteUrl } from "@/_helper";

export const DEFAULT_META = {
    title: "Katanoff Fine Jewelry",
    description:
        "Discover fine jewelry, engagement rings, custom designs, and more at Katanoff.",
    keywords: "Katanoff jewelry, fine jewelry, engagement rings",
    url: WebsiteUrl,
    openGraphImage: "/opengraph-image.png",
    siteName: "Katanoff",
};

export const PAGE_META = {
    [META_CONSTANTS.HOME]: DEFAULT_META,
    [META_CONSTANTS.SIGN_UP]: {
        title: "Create Your Katanoff Account",
        description:
            "Sign up to explore fine jewelry, custom designs, and exclusive offers from Katanoff.",
        keywords:
            "Katanoff sign up, create account, jewelry account",
        url: `${WebsiteUrl}/auth/sign-up`,
    },

    [META_CONSTANTS.LOGIN]: {
        title: "Login to Katanoff",
        description:
            "Access your Katanoff account to manage orders, jewelry, and custom designs.",
        keywords:
            "Katanoff login, jewelry login, account access",
        url: `${WebsiteUrl}/auth/login`,
    },

    [META_CONSTANTS.VERIFY_OTP]: {
        title: "Verify Your Katanoff Account",
        description:
            "Securely verify your account with OTP to continue shopping at Katanoff.",
        keywords:
            "Katanoff OTP, verify account, secure login",
        url: `${WebsiteUrl}/auth/verify-otp`,
    },

    [META_CONSTANTS.PROFILE]: {
        title: "My Katanoff Profile",
        description:
            "View and update your Katanoff profile, track orders, and manage preferences.",
        keywords:
            "Katanoff profile, account details, jewelry account",
        url: `${WebsiteUrl}/profile`,
    },
    [META_CONSTANTS.RETURN_HISTORY]: {
        title: "Return History – Katanoff",
        description:
            "Check your return history and refund updates easily at Katanoff.",
        keywords:
            "return history, jewelry return, refund status",
        url: `${WebsiteUrl}/return-history`,
    },
    [META_CONSTANTS.ORDER_HISTORY]: {
        title: "Order History – Katanoff",
        description:
            "View your complete order history and track jewelry purchases.",
        keywords:
            "order history, track orders, jewelry orders",
        url: `${WebsiteUrl}/order-history`,
    },

    [META_CONSTANTS.CONTACT_US]: {
        title: "Contact Katanoff Jewelry",
        description:
            "Have questions? Contact Katanoff for assistance with jewelry, orders, or custom designs.",
        keywords:
            "contact Katanoff, jewelry support, jewelry help",
        url: `${WebsiteUrl}/contact-us`
    },

    [META_CONSTANTS.CUSTOM_JEWELRY]: {
        title: "Custom Jewelry by Katanoff",
        description:
            "Design custom jewelry with expert craftsmanship and unique diamond settings.",
        keywords:
            "custom jewelry, jewelry design, personalized jewelry",
        url: `${WebsiteUrl}/custom-jewelry`
    },

    [META_CONSTANTS.CUSTOM_JEWELRY_FORM]: {
        title: "Custom Jewelry Request – Katanoff",
        description:
            "Submit your custom jewelry request and let Katanoff bring your vision to life.",
        keywords:
            "custom jewelry form, jewelry request, design jewelry",
        url: `${WebsiteUrl}/custom-jewelry-form`
    },

    [META_CONSTANTS.PAYMENT_FINANCING]: {
        title: "Jewelry Financing – Katanoff",
        description:
            "Explore flexible payment and financing options for your jewelry purchase.",
        keywords:
            "jewelry financing, payment plans, Katanoff payment",
        url: `${WebsiteUrl}/payment-financing`,
    },

    [META_CONSTANTS.BOOK_APPOINTMENT]: {
        title: "Book an Appointment – Katanoff",
        description:
            "Schedule an appointment to explore Katanoff jewelry and custom designs.",
        keywords:
            "book appointment, jewelry appointment, Katanoff visit",
        url: `${WebsiteUrl}/book-appointment`
    },

    [META_CONSTANTS.PRIVACY_POLICY]: {
        title: "Privacy Policy – Katanoff",
        description:
            "Learn how Katanoff protects your privacy and personal data.",
        keywords:
            "privacy policy, Katanoff privacy, jewelry data",
        url: `${WebsiteUrl}/privacy-policy`,
    },

    [META_CONSTANTS.RETURN_POLICY]: {
        title: "Return Policy – Katanoff",
        description:
            "Review Katanoff’s return policy for jewelry and custom pieces.",
        keywords:
            "return policy, jewelry returns, Katanoff refund",
        url: `${WebsiteUrl}/return-policy`,
    },

    [META_CONSTANTS.SEARCH]: {
        title: "Search Jewelry – Katanoff",
        description:
            "Find fine jewelry, rings, earrings, and more with our search tool.",
        keywords:
            "jewelry search, find jewelry, Katanoff rings",
        url: `${WebsiteUrl}/search`,
    },

    [META_CONSTANTS.SHIPPING_POLICY]: {
        title: "Shipping Policy – Katanoff",
        description:
            "Learn about Katanoff’s shipping process, delivery times, and charges.",
        keywords:
            "shipping policy, jewelry shipping, Katanoff delivery",
        url: `${WebsiteUrl}/shipping-policy`,
    },

    [META_CONSTANTS.TERMS_AND_CONDITIONS]: {
        title: "Terms & Conditions – Katanoff",
        description:
            "Review Katanoff’s terms and conditions before making a jewelry purchase.",
        keywords:
            "terms and conditions, jewelry terms, Katanoff terms",
        url: `${WebsiteUrl}/terms-and-conditions`,
    },

    [META_CONSTANTS.TRACK_YOUR_RETURN]: {
        title: "Track Return – Katanoff",
        description:
            "Easily track the status of your return with Katanoff’s online tool.",
        keywords:
            "track return, jewelry return, refund status",
        url: `${WebsiteUrl}/track-your-return`,
    },

    [META_CONSTANTS.TRACK_YOUR_ORDER]: {
        title: "Track Order – Katanoff",
        description:
            "Enter your details to track your jewelry order with Katanoff.",
        keywords:
            "track order, jewelry tracking, Katanoff order",
        url: `${WebsiteUrl}/track-your-order`,
    },

    [META_CONSTANTS.WARRANTY]: {
        title: "Jewelry Warranty – Katanoff",
        description:
            "Explore Katanoff’s jewelry warranty for guaranteed quality and peace of mind.",
        keywords:
            "jewelry warranty, diamond warranty, Katanoff guarantee",
        url: `${WebsiteUrl}/warranty`,
    },

    [META_CONSTANTS.CART]: {
        title: "Shopping Cart – Katanoff",
        description:
            "Review items in your shopping cart before completing your jewelry order.",
        keywords:
            "shopping cart, jewelry cart, Katanoff cart",
        url: `${WebsiteUrl}/cart`
    },

    [META_CONSTANTS.CHECKOUT]: {
        title: "Checkout – Katanoff Jewelry",
        description:
            "Complete your jewelry order securely at Katanoff checkout.",
        keywords:
            "checkout, jewelry checkout, secure payment",
        url: `${WebsiteUrl}/checkout`
    },

    [META_CONSTANTS.COMPLETE_RING]: {
        title: "Complete Your Ring – Katanoff",
        description:
            "Select diamond and setting to complete your personalized ring design.",
        keywords:
            "complete ring, custom ring, diamond setting",
        url: `${WebsiteUrl}/customize/complete-ring`
    },

    [META_CONSTANTS.SELECT_DIAMOND]: {
        title: "Choose a Diamond – Katanoff",
        description:
            "Browse certified diamonds and create your dream engagement ring.",
        keywords:
            "select diamond, buy diamond, engagement diamond",
        url: `${WebsiteUrl}/customize/select-diamond`
    },

    [META_CONSTANTS.SELECT_SETTING]: {
        title: "Choose a Ring Setting – Katanoff",
        description:
            "Pick the perfect ring setting for your custom diamond engagement ring.",
        keywords:
            "select setting, ring setting, engagement setting",
        url: `${WebsiteUrl}/customize/select-setting`
    },

    [META_CONSTANTS.SHIPPING]: {
        title: "Shipping Info – Katanoff",
        description:
            "Get shipping updates, delivery timelines, and status for your jewelry order.",
        keywords:
            "shipping info, order shipping, jewelry delivery",
        url: `${WebsiteUrl}/shipping`,
    },

    [META_CONSTANTS.ABOUT_US]: {
        title: "About Katanoff Jewelry",
        description:
            "Discover Katanoff’s story, craftsmanship, and passion for fine jewelry.",
        keywords:
            "about Katanoff, jewelry brand, fine jewelry story",
        url: `${WebsiteUrl}/about-us`
    },

    [META_CONSTANTS.EDUCATION]: {
        title: "Jewelry Education – Katanoff",
        description:
            "Learn about diamonds, rings, and fine jewelry with Katanoff’s education center.",
        keywords:
            "jewelry education, diamond guide, jewelry learning",
        url: `${WebsiteUrl}/education`
    },
};
