import { META_CONSTANTS, WebsiteUrl } from "@/_helper";

export const DEFAULT_META = {
    title: "Lab Grown Diamond Jewelry NYC | Katanoff",
    description:
        "Shop ethical lab grown diamond rings, bracelets, necklaces & fine jewelry in New York.",
    keywords: "lab grown diamond jewelry, custom jewelry, fine jewelry, New York",
    url: WebsiteUrl,
    openGraphImage: `${WebsiteUrl}/opengraph-image.png`,
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
        title: "Contact Katanoff | Lab Diamonds",
        description:
            "Get in touch with Katanoff for lab grown diamond jewelry in New York.",
        keywords:
            "contact Katanoff, lab grown diamond jewelry, NYC",
        url: `${WebsiteUrl}/contact-us`
    },

    [META_CONSTANTS.CUSTOM_JEWELRY]: {
        title: "Custom Diamond Jewelry NYC | Katanoff",
        description:
            "Design custom lab grown diamond engagement and wedding jewelry in NYC.",
        keywords:
            "custom jewelry, lab grown diamonds, engagement rings",
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
        title: "Payment & Financing | Katanoff",
        description:
            "Flexible financing options for lab grown diamond jewelry at Katanoff NYC.",
        keywords:
            "financing, payment options, diamond jewelry",
        url: `${WebsiteUrl}/payment-financing`,
    },

    [META_CONSTANTS.BOOK_APPOINTMENT]: {
        title: "Book Jewelry Appointment | Katanoff",
        description:
            "Schedule your consultation for custom lab grown diamond engagement and wedding jewelry.",
        keywords:
            "book appointment, jewelry consultation, custom diamonds",
        url: `${WebsiteUrl}/book-appointment`
    },

    [META_CONSTANTS.PRIVACY_POLICY]: {
        title: "Privacy Policy | Katanoff Jewelry",
        description:
            "Read Katanoff’s privacy policy for lab grown diamond jewelry buyers.",
        keywords:
            "privacy policy, Katanoff, lab grown jewelry",
        url: `${WebsiteUrl}/privacy-policy`,
    },

    [META_CONSTANTS.RETURN_POLICY]: {
        title: "Return Policy | Katanoff Jewelry",
        description:
            "Review our return policy for lab grown diamond jewelry in New York.",
        keywords:
            "return policy, diamond jewelry, Katanoff",
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
        title: "Shipping Policy | Katanoff Jewelry",
        description:
            "Shipping policy for Katanoff lab grown diamond jewelry orders in NYC.",
        keywords:
            "shipping policy, lab grown jewelry, Katanoff",
        url: `${WebsiteUrl}/shipping-policy`,
    },

    [META_CONSTANTS.SITE_MAP]: {
        title: "Site Map | Katanoff Jewelry",
        description:
            "Browse the site map for Katanoff lab grown diamond jewelry online.",
        keywords:
            "site map, Katanoff, lab grown jewelry",
        url: `${WebsiteUrl}/site-map`,
    },

    [META_CONSTANTS.TERMS_AND_CONDITIONS]: {
        title: "Terms & Conditions | Katanoff",
        description:
            "Review Katanoff jewelry’s terms and conditions for diamond purchases.",
        keywords:
            "terms and conditions, Katanoff, lab grown jewelry",
        url: `${WebsiteUrl}/terms-and-conditions`,
    },

    [META_CONSTANTS.TRACK_YOUR_RETURN]: {
        title: "Track Your Return | Katanoff",
        description:
            "Track your lab grown diamond jewelry return with Katanoff online.",
        keywords:
            "track return, Katanoff, diamond jewelry",
        url: `${WebsiteUrl}/track-your-return`,
    },

    [META_CONSTANTS.TRACK_YOUR_ORDER]: {
        title: "Track Your Order | Katanoff",
        description:
            "Track your lab grown diamond jewelry order online at Katanoff NYC.",
        keywords:
            "track order, Katanoff, lab grown diamond",
        url: `${WebsiteUrl}/track-your-order`,
    },

    [META_CONSTANTS.WARRANTY]: {
        title: "Warranty | Katanoff Jewelry",
        description:
            "View warranty details for Katanoff’s lab grown diamond fine jewelry.",
        keywords:
            "warranty, lab grown jewelry, Katanoff",
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
        title: "Select Diamonds | Lab Grown",
        description:
            "Choose lab grown diamonds in all shapes for custom jewelry in NYC.",
        keywords:
            "lab grown diamonds, select diamonds, custom jewelry",
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
        title: "About Katanoff | Lab Grown Diamonds",
        description:
            "Learn about Katanoff’s ethical lab grown diamonds and fine jewelry expertise in NYC.",
        keywords:
            "about Katanoff, ethical diamonds, lab grown jewelry, NYC",
        url: `${WebsiteUrl}/about-us`
    },

    [META_CONSTANTS.EDUCATION]: {
        title: "Diamond Education | Lab Grown Guide",
        description:
            "Learn about lab grown diamonds, the 4Cs, and ethical fine jewelry.",
        keywords:
            "diamond education, lab grown guide, diamond 4Cs",
        url: `${WebsiteUrl}/education`
    },
};
