import { generateMetadata } from "@/_utils/metaConfig";
import { META_CONSTANTS, WebsiteUrl } from "@/_helper";
import Script from "next/script";
export const metadata = generateMetadata({
    pageName: [META_CONSTANTS.FOREVER_DIAMONDS],
});

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPage",
    mainEntity: {
        "@type": "Organization",
        name: "Katanoff Diamonds",
        url: `${WebsiteUrl}/blogs/forever-diamonds`,
    },
};

export default function ForeverDiamondsLayout({ children }) {
    return (
        <div>
            <h1 className="hidden">Forever Diamonds</h1>

            {children}
            <Script
                id="jewelry-schema"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </div>
    );
}
