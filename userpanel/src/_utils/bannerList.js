import forHim from "@/assets/images/banners/for-him.webp"
import lustera from "@/assets/images/banners/lustera.webp"
import diamora from "@/assets/images/banners/diamora.webp"
import veloura from "@/assets/images/banners/veloura.webp"
import brightborn from "@/assets/images/banners/brightborn.webp"
import auralis from "@/assets/images/banners/auralis.webp"
import glowState from "@/assets/images/banners/glow-state.webp"
import nuvana from "@/assets/images/banners/nuvana.webp"
import trending from "@/assets/images/banners/trending.webp"
import newAura from "@/assets/images/banners/new-aura.webp"
import giftForHim from "@/assets/images/banners/gift-for-him.webp"
import giftForHer from "@/assets/images/banners/gift-for-her.webp"
import theRealIllusion from "@/assets/images/banners/the-real-illusion.webp"
import jewelry from "@/assets/images/banners/jewelry.webp"
import gemora from "@/assets/images/banners/gemora.webp"
import newArrivals from "@/assets/images/banners/new-arrivals.webp"
import under500 from "@/assets/images/banners/under-500.webp"
import forHer from "@/assets/images/banners/for-her.webp"
import wedding from "@/assets/images/banners/wedding.webp"
import bracelets from "@/assets/images/banners/bracelets.webp"
import earrings from "@/assets/images/banners/earrings.webp"
import mensJewelry from "@/assets/images/banners/mens-jewelry.webp"
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
            title: "Flash Deals",
            banner: flashDeals,
        }
    },
    {
        collection: {
            title: "Lustera",
            banner: lustera,
        }
    },
    {
        collection: {
            title: "Diamora",
            banner: diamora,
        }
    },
    {
        collection: {
            title: "Veloura",
            banner: veloura,
        }
    },
    {
        collection: {
            title: "Glow State",
            banner: glowState,
        }
    },
    {
        collection: {
            title: "Brightborn",
            banner: brightborn,
        }
    },
    {
        collection: {
            title: "Auralis",
            banner: auralis,
        }
    },
    {
        collection: {
            title: "Nuvana",
            banner: nuvana,
        }
    },
    {
        collection: {
            title: "Gemora",
            banner: gemora,
        }
    },
    {
        collection: {
            title: "New Aura",
            banner: newAura,
        }
    },
    {
        collection: {
            title: "The Real Illusion",
            banner: theRealIllusion,
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
        title: "Wedding",
        banner: wedding,
        subCategories: [
            {
                title: "For Her",
                type: "subCategories",
                banner: forHer,
            },
            {
                title: "For Him",
                type: "subCategories",
                banner: forHim,
            }
        ]
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
                title: "Men’s Jewelry",
                type: "subCategories",
                banner: mensJewelry,
            }
        ]
    }
]