import trending from "@/assets/images/banners/trending.webp";
import under500 from "@/assets/images/banners/under-500.webp";
import wedding from "@/assets/images/banners/wedding.webp";
import earrings from "@/assets/images/banners/earrings.webp";
import mensJewelry from "@/assets/images/banners/mens-jewelry.webp";
import necklaces from "@/assets/images/banners/necklaces.webp";



// New Arrivals
import desktopNewArrivals from "@/assets/images/banners/desktop-new-arrivals.webp";
import mobileNewArrivals from "@/assets/images/banners/mobile-new-arrivals.webp";

// Flash Deals
import desktopFlashDeals from "@/assets/images/banners/desktop-flash-deals.webp";
import mobileFlashDeals from "@/assets/images/banners/mobile-flash-deals.webp";

// Gift For Him
import desktopGiftForHim from "@/assets/images/banners/desktop-gift-for-him.webp";
import mobileGiftForHim from "@/assets/images/banners/mobile-gift-for-him.webp";

// Gift For Her
import desktopGiftForHer from "@/assets/images/banners/desktop-gift-for-her.webp";
import mobileGiftForHer from "@/assets/images/banners/mobile-gift-for-her.webp";

// Engagement Rings
import desktopEngagementRings from "@/assets/images/banners/desktop-engagement-rings.webp";
import mobileEngagementRings from "@/assets/images/banners/mobile-engagement-rings.webp";

// Bracelets
import desktopBracelets from "@/assets/images/banners/desktop-bracelets.webp";
import mobileBracelets from "@/assets/images/banners/mobile-bracelets.webp";

// Fashion
import desktopFashion from "@/assets/images/banners/desktop-fashion.webp";
import mobileFashion from "@/assets/images/banners/mobile-fashion.webp";

// Quick Ship Gift
import desktopQuickShipGift from "@/assets/images/banners/desktop-quick-ship-gift.webp";
import mobileQuickShipGift from "@/assets/images/banners/mobile-quick-ship-gift.webp";

// Jewelry
import desktopJewelry from "@/assets/images/banners/desktop-jewelry.webp";
import mobileJewelry from "@/assets/images/banners/mobile-jewelry.webp";

// Rings
import desktopRings from "@/assets/images/banners/desktop-rings.webp"
import mobileRings from "@/assets/images/banners/mobile-rings.webp"

// High Jewelry
import desktopHighJewelry from "@/assets/images/banners/desktop-high-jewelry.webp"
import mobileHighJewelry from "@/assets/images/banners/mobile-high-jewelry.webp"

// Tennis
import desktopTennis from "@/assets/images/banners/desktop-tennis.webp"
import mobileTennis from "@/assets/images/banners/mobile-tennis.webp"

// Special Buys
import desktopSpecialBuys from "@/assets/images/banners/desktop-special-buys.webp"
import mobileSpecialBuys from "@/assets/images/banners/mobile-special-buys.webp"

export const bannerList = [
    {
        collection: {
            title: "High Jewelry",
            banner: {
                desktop: desktopHighJewelry,
                mobile: mobileHighJewelry,
            },
        },
    },
    {
        collection: {
            title: "Tennis",
            banner: {
                desktop: desktopTennis,
                mobile: mobileTennis,
            },
        },
    },
    {
        collection: {
            title: "Special Buys",
            banner: {
                desktop: desktopSpecialBuys,
                mobile: mobileSpecialBuys,
            },
        },
    },
    {
        collection: {
            title: "Wedding Rings",
            banner: {
                desktop: desktopRings,
                mobile: wedding,
            },
        },
    },
    {
        collection: {
            title: "Quick Ship Gifts",
            banner: {
                desktop: desktopQuickShipGift,
                mobile: mobileQuickShipGift,
            },
        },
    },
    {
        collection: {
            title: "Fashion",
            banner: {
                desktop: desktopFashion,
                mobile: mobileFashion,
            },
        },
    },
    {
        collection: {
            title: "Engagement Rings",
            banner: {
                desktop: desktopEngagementRings,
                mobile: mobileEngagementRings,
            },
        },
    },
    {
        collection: {
            title: "Flash Deals",
            banner: {
                desktop: desktopFlashDeals,
                mobile: mobileFlashDeals,
            },
        },
    },
    {
        collection: {
            title: "Gifts Under $500",
            banner: {
                desktop: under500,
                mobile: under500,
            },
        },
    },
    {
        collection: {
            title: "Gifts For Her",
            banner: {
                desktop: desktopGiftForHer,
                mobile: mobileGiftForHer,
            },
        },
    },
    {
        collection: {
            title: "Gifts For Him",
            banner: {
                desktop: desktopGiftForHim,
                mobile: mobileGiftForHim,
            },
        },
    },
    {
        collection: {
            title: "New Arrival",
            banner: {
                desktop: desktopNewArrivals,
                mobile: mobileNewArrivals,
            },
        },
    },
    {
        collection: {
            title: "Trending",
            banner: {
                desktop: trending,
                mobile: trending,
            },
        },
    },
    {
        type: "categories",
        title: "Jewelry",
        banner: {
            desktop: desktopJewelry,
            mobile: mobileJewelry,
        },
        subCategories: [
            {
                title: "Rings",
                type: "subCategories",
                banner: {
                    desktop: desktopRings,
                    mobile: mobileRings,
                },
            },
            {
                title: "Earrings",
                type: "subCategories",
                banner: {
                    desktop: earrings,
                    mobile: mobileRings,
                },
            },
            {
                title: "Bracelets",
                type: "subCategories",
                banner: {
                    desktop: desktopBracelets,
                    mobile: mobileBracelets,
                },
            },
            {
                title: "Necklaces",
                type: "subCategories",
                banner: {
                    desktop: necklaces,
                    mobile: necklaces,
                },
            },
            {
                title: "Men’s",
                type: "subCategories",
                banner: {
                    desktop: mensJewelry,
                    mobile: mensJewelry,
                },
            },
        ],
    },
];
