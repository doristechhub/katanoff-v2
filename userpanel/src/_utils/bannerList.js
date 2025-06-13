import trending from "@/assets/images/banners/trending.webp";
import giftForHim from "@/assets/images/banners/gift-for-him.webp";
import giftForHer from "@/assets/images/banners/gift-for-her.webp";
import newArrivals from "@/assets/images/banners/new-arrivals.webp";
import under500 from "@/assets/images/banners/under-500.webp";
import wedding from "@/assets/images/banners/wedding.webp";
import bracelets from "@/assets/images/banners/bracelets.webp";
import earrings from "@/assets/images/banners/earrings.webp";
import mensJewelry from "@/assets/images/banners/mens-jewelry.webp";
import engagementRings from "@/assets/images/banners/engagement-rings.webp";
import flashDeals from "@/assets/images/banners/flash-deals.webp";
import necklaces from "@/assets/images/banners/necklaces.webp";

// Jewelry
import desktopJewelry from "@/assets/images/banners/desktop-jewelry.webp";
import mobileJewelry from "@/assets/images/banners/mobile-jewelry.webp";

// Rings
import desktopRings from "@/assets/images/banners/desktop-rings.webp"
import mobileRings from "@/assets/images/banners/mobile-rings.webp"

export const bannerList = [
    {
        collection: {
            title: "Wedding Rings",
            banner: {
                desktop: wedding,
                mobile: wedding,
            },
        },
    },
    {
        collection: {
            title: "Engagement Rings",
            banner: {
                desktop: engagementRings,
                mobile: engagementRings,
            },
        },
    },
    {
        collection: {
            title: "Flash Deals",
            banner: {
                desktop: flashDeals,
                mobile: flashDeals,
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
                desktop: giftForHer,
                mobile: giftForHer,
            },
        },
    },
    {
        collection: {
            title: "Gifts For Him",
            banner: {
                desktop: giftForHim,
                mobile: giftForHim,
            },
        },
    },
    {
        collection: {
            title: "New Arrival",
            banner: {
                desktop: newArrivals,
                mobile: newArrivals,
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
                    desktop: bracelets,
                    mobile: bracelets,
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
