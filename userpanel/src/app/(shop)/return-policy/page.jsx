import { companyEmail } from "@/_helper";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import PolicyContent from "@/components/ui/PolicyContent";
const privacySections = [
    {
        description:
            'At Katanoff, your satisfaction is our priority. We want you to love your purchase—but if for any reason you’re not completely happy, we offer free returns to make things right.',
    },
    {
        description: (
            <>
                <p><strong>30-Day Free Returns</strong></p>
                <p>You can return your item(s) within 30 days from the date of delivery—completely free.No hidden fees, no restocking charges.</p>
                <p>Conditions for Returns</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>To be eligible for a return:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Item must be in its original condition—unworn, undamaged, and unaltered.</li>
                    <li>All original packaging, certificates, and documents must be included.</li>
                    <li>Custom, engraved, or personalized items may not be eligible for return unless defective.</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>How to Initiate a Return</strong></p>
                <ol className="list-decimal list-inside mt-2">
                    <li>{`Contact Us: Email our support team at ${companyEmail} or fill out the return request form.`}</li>
                    <li>Receive a Free Shipping Label: We'll email you a prepaid shipping label.</li>
                    <li>Pack & Ship: Securely pack your item with all original contents and drop it off at the nearest shipping center.</li>
                </ol>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Refund Process</strong></p>
                <p>Once we receive and inspect your return:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>A full refund will be issued to your original payment method.</li>
                    <li>Refunds are typically processed within 5–7 business days of receiving the return.</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Non-Returnable Items</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Final sale items</li>
                    <li>Gift cards</li>
                    <li>Items that show signs of wear, damage, or alteration.</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Questions?</strong></p>
                <p>{`We’re here to help! Reach out to us at ${companyEmail}, and we’ll be happy to guide you through the return process.`}</p>
            </>
        ),
    },
];

const ReturnPolicy = () => {
    return (
        <div className="flex flex-col">
            <CommonBgHeading
                title="Return Policy"
                backText="Back To Home"
                backHref="/"
            />
            <div className="container ">
                <PolicyContent sections={privacySections} />
            </div>
        </div>
    );
};

export default ReturnPolicy;
