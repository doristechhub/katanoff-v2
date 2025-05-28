import { companyEmail, companyPhoneNo } from "@/_helper";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import PolicyContent from "@/components/ui/PolicyContent";
const paymentFinancingSections = [
    {
        description: (
            <>
                <p>At Katanoff, we’re here to make shopping as smooth and flexible as possible. Whether you're paying in full or prefer to split it into installments, we have secure options designed with you in mind.</p>
            </>
        )
    },
    {
        description: (
            <>
                <p><strong>Accepted Payment Methods</strong></p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>We accept all major U.S. payment types:</strong></p>
                <ul className="list-disc list-inside mt-2">
                    <li>Visa, MasterCard, American Express, Discover</li>
                    <li>PayPal</li>
                    <li>Apple Pay & Google Pay</li>
                    <li>Shop Pay</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p>Your payment is processed securely with industry-standard encryption. We never store your card details.</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Sales Tax</strong></p>
                <p>Applicable sales tax will be calculated based on your shipping address and shown during checkout, in accordance with U.S. state laws.</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Flexible Financing with Shop Pay Installments</strong></p>
            </>
        ),
    },
    {
        description: (
            <>
                <p>Want to spread out your payments? Choose Shop Pay Installments at checkout.</p>
                <p>With Shop Pay, you can:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>Split your purchase into 4 interest-free biweekly payments</li>
                    <li>Or choose monthly financing options (for qualifying purchases)</li>
                    <li>No hidden fees—you see your terms clearly before you commit</li>
                </ul>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>How it works:</strong></p>
            </>
        ),
    },
    {
        description: (
            <>
                <ol className="list-decimal list-inside mt-2">
                    <li>Add your items to the cart</li>
                    <li>Select Shop Pay Installments at checkout</li>
                    <li>Get an instant decision—no hard credit check for most plans</li>
                    <li>Enjoy your jewelry now, pay over time</li>
                </ol>
                <p>Financing is available on purchases up to $17,500, subject to eligibility.</p>
            </>
        ),
    },
    {
        description: (
            <>
                <p><strong>Questions or Special Requests?</strong></p>
                <p>{`Need help with a large order or have a question about payment? Email us at ${companyEmail} or call us at ${companyPhoneNo}. We’re happy to assist!`}</p>
            </>
        ),
    },
];

const PaymentFinancing = () => {
    return (
        <div className="flex flex-col">
            <CommonBgHeading
                title="Payment and Financing"
                backText="Back To Home"
                backHref="/"
            />
            <div className="container">
                <PolicyContent sections={paymentFinancingSections} />
            </div>
        </div>
    );
};

export default PaymentFinancing;
