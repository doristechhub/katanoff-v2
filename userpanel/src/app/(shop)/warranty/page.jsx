import { companyEmail, companyPhoneNo } from "@/_helper";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import PolicyContent from "@/components/ui/PolicyContent";
const warrantySections = [
    {
        description: (
            <>
                <p>At Katanoff, we take great pride in the quality and craftsmanship of our jewelry. Each piece is designed with care and built to last. To ensure your peace of mind, we offer a comprehensive warranty on all our fine and fashion jewelry.</p>
                <p>Warranty Coverage</p>
            </>
        )
    },
    {
        description: (
            <>
                <p><strong>Our standard warranty covers the following for a period of 12 months from the date of purchase:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Manufacturing defects in materials or craftsmanship</li>
                    <li>Broken clasps, loose prongs, or faulty chains</li>
                    <li>Missing stones due to manufacturing issues</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>What’s Not Covered</strong></p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Our warranty does not cover:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Normal wear and tear</li>
                    <li>Lost or stolen items</li>
                    <li>Damage caused by accidents, improper care, or unauthorized repair</li>
                    <li>Scratches, dents, or tarnishing from regular use</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>How to Make a Warranty Claim</strong></p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>{`To initiate a claim, please email us at ${companyEmail} with the following:`}</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Your order number or proof of purchase</li>
                    <li>Photos of the item and the issue</li>
                    <li>A brief description of the problem</li>
                </ul>
            </>
        ),
    },
    {
        description:
            'Our team will review your claim and respond within 2–3 business days with the next steps. In some cases, items may need to be sent in for inspection.',
    },
    {
        description: (
            <>
                <p><strong>Repairs Outside of Warranty</strong></p>
                <p>We offer repair services even after your warranty period ends. Reach out to us for a quote and timeline.</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Questions?</strong></p>
                <p>We're here to help. If you have any questions about your jewelry or our warranty policy, please contact us at <strong>{companyPhoneNo}</strong>.</p>
            </>
        ),
    },
];

const Warranty = () => {
    return (
        <div className="flex flex-col">
            <CommonBgHeading
                title="Warranty"
                backText="Back To Home"
                backHref="/"
            />
            <div className="container">
                <PolicyContent sections={warrantySections} />
            </div>
        </div>
    );
};

export default Warranty;
