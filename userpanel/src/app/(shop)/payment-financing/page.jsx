import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyPhoneNo } from "@/_helper";
import { AccordionTabs } from "@/components/dynamiComponents";

const paymentFinancingSections = [
  {
    label: "What payment options are available?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            For U.S. orders, Katanoff accepts all major US credit cards, Paypal,
            Venmo (mobile checkout only), Apple Pay, and Google Pay.
          </p>
          <p>
            We have financing available through Affirm. Choose up to 36 monthly
            payments, from 0% APR financing.
          </p>
          <p>
            For customers with low or no credit, we offer a lease-to-own option
            through Katapult. There is no credit required, no surprises, and
            never a late fee, ever.
          </p>
          <p>
            We also accept Bank Wire Transfers. Note that ACH payments are not
            accepted at this time. Only direct wire transfers are supported.
            Your bank may charge you a fee to send a wire transfer. If you wish
            to make a payment via wire transfer, please contact us {companyPhoneNo}.
          </p>
          <p>
            For International orders, we accept all major credit cards, PayPal,
            Apple Pay and Google Pay in most countries. Some countries may offer
            additional payment options.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Do you offer financing?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            For U.S. customers, we offer financing through Affirm. If qualified,
            choose up to 36 monthly payments, from 0% APR financing. At
            checkout, choose Affirm as your payment method, then create an
            account and answer a few questions. You will be notified immediately
            whether you’ve been approved. All future monthly payments and
            financing terms will be handled through your Affirm account.
          </p>
         <p>
          To learn more about Affirm financing.
         </p>
          </div>
         <p>
          You may pre-qualify for Affirm financing.
         </p>
        <p>
          To speak to Affirm directly, contact them at Affirm.com or call{" "}
          {companyPhoneNo}
        </p>
      
      </>
    ),
  },
  {
    label: "Can I make a split tender payment?",
    content: (
      <>
        <p>
          Unfortunately, we do not offer split payments between two different
          credit cards or payment types at this time.
        </p>
      </>
    ),
  },
  {
    label: "Do you offer wire transfer payments?",
    content: (
      <>
        <p>
          We accept Bank Wire Transfers. Note that ACH payments are not accepted
          at this time. Only direct bank wire transfers are supported. Your bank
          may charge you a fee to send a wire transfer. If you wish to make a
          payment via wire transfer, contact a customer service representative,
          and we will assist you.
        </p>
      </>
    ),
  },
];

const PaymentFinancing = () => {
  return (
    <>
      <CommonBgHeading
        title="Payment and Financing"
        backText="Back To Home"
        backHref="/"
      />

      <div className="container normal-case mb-10">
        <h2 className="pl-4 lg:pl-0  text-lg xxs:text-2xl md:text-3xl xl:text-4xl text-baseblack font-castoro pt-8 xxs:pt-12 lg:pt-20">
          Payment & Financing Questions
        </h2>
        <div className="border-t border-t-grayborder mt-6 md:mt-10 lg:mt-12"/>

        <AccordionTabs
          tabs={paymentFinancingSections}
          defaultOpenLabel="What payment options are available?"
          forceResetKey="payment-financing"
          contentCustomClass="md:text-lg"
        />
      </div>
    </>
  );
};

export default PaymentFinancing;
