import { companyEmail } from "@/_helper";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import PolicyContent from "@/components/ui/PolicyContent";

const privacySections = [
    {
        description:
            'We’re committed to delivering your jewelry safely, quickly, and at no extra cost to you. That’s why every order ships free—no matter the value, no matter the destination (within the U.S.).',
    },
    {
        description: (
            <>
                <p><strong>Free Shipping on All Orders</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>We proudly offer free standard shipping on all U.S. orders. No minimums. No catches.</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Processing & Delivery Time</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Standard Shipping (Free): Arrives in 5–7 business days after processing.</li>
                    <li>Expedited Shipping (Optional): Available at checkout for an additional cost.</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Processing time varies depending on the item:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>In-stock items usually ship within 1–2 business days.</li>
                    <li>Made-to-order or customized items may take additional time (details provided at checkout or product page).</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>International Shipping</strong></p>
                <p>We currently do not offer international shipping. Stay tuned—Katanoff is growing, and we hope to serve you worldwide soon!</p>
                <p>Secure & Insured Delivery</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Every order is:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Fully insured during transit</li>
                    <li>Signature-required upon delivery (for orders over a certain value)</li>
                    <li>Carefully packaged to protect your piece until it reaches you</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Tracking Your Order</strong></p>
                <p>Once your item ships, you’ll receive a confirmation email with a tracking number so you can follow your jewelry’s journey to your door.</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Questions?</strong></p>
                <p>{`Need help with your delivery or a special shipping request? Reach out to us at ${companyEmail} —we’re here to help!`}</p>
            </>
        ),
    },
];

const ShippingPolicy = () => {
    return (
        <div className="flex flex-col">
            <CommonBgHeading
                title="Shipping Policy"
                backText="Back To Home"
                backHref="/"
            />
            <div className="container">
                <PolicyContent sections={privacySections} />
            </div>
        </div>
    );
};

export default ShippingPolicy;
