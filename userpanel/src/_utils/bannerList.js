import trending from "@/assets/images/banners/trending.webp"
import giftForHim from "@/assets/images/banners/gift-for-him.webp"
import giftForHer from "@/assets/images/banners/gift-for-her.webp"
import jewelry from "@/assets/images/banners/jewelry.webp"
import newArrivals from "@/assets/images/banners/new-arrivals.webp"
import under500 from "@/assets/images/banners/under-500.webp"
import wedding from "@/assets/images/banners/wedding.webp"
import bracelets from "@/assets/images/banners/bracelets.webp"
import earrings from "@/assets/images/banners/earrings.webp"
import mensJewelry from "@/assets/images/banners/mens-jewelry.webp"
import engagementRings from "@/assets/images/banners/engagement-rings.webp"
import flashDeals from "@/assets/images/banners/flash-deals.webp"
import necklaces from "@/assets/images/banners/necklaces.webp"

export const bannerList = [
    {
        collection: {
            title: "Wedding Rings",
            banner: wedding,
        }
    },
    {
        collection: {
            title: "Engagement Rings",
            banner: engagementRings,
        }
    },
    {
        collection: {
            title: "Flash Deals",
            banner: flashDeals,
        }
    },
    {
        collection: {
            title: "Gifts Under $500",
            banner: under500,
        }
    },
    {
        collection: {
            title: "Gifts For Her",
            banner: giftForHer,
        }
    },
    {
        collection: {
            title: "Gifts For Him",
            banner: giftForHim,
        }
    },
    {
        collection: {
            title: "New Arrival",
            banner: newArrivals,
        }
    },
    {
        collection: {
            title: "Trending",
            banner: trending,
        }
    },
    {
        type: "categories",
        title: "Jewelry",
        banner: jewelry,
        subCategories: [
            {
                title: "Earrings",
                type: "subCategories",
                banner: earrings,
            },
            {
                title: "Bracelets",
                type: "subCategories",
                banner: bracelets,
            },
            {
                title: "Necklaces",
                type: "subCategories",
                banner: necklaces,
            }, {
                title: "Men’s",
                type: "subCategories",
                banner: mensJewelry,
            }
        ]
    }
]