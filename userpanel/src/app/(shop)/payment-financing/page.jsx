import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const PaymentFinancingContent = [
  {
    label: "Flexible Payment Options",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At <b>Katanoff</b>, we believe that exceptional jewelry should be
          within reach—without having to compromise your financial comfort.
          That’s why we offer a variety of{" "}
          <b>secure and flexible payment methods</b> designed to make your
          shopping experience smooth, accessible, and worry- free. Whether you
          choose to pay upfront or prefer to break up your purchase over time,
          we’re here to help make luxury more manageable.
        </p>
      </div>
    ),
  },
  {
    label: "Multiple Ways to Pay Securely",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          To accommodate your preferences, we accept several trusted payment
          methods. You can complete your purchase using:
        </p>
        <ul className="ps-5 list-disc">
          <li>
            <b>All major credit and debit cards</b>, including Visa, Mastercard,
            American Express, and Discover.
          </li>
          <li>
            <b>PayPal,</b> which offers a safe and seamless way to check out
            using your PayPal balance, linked bank account, or preferred card.
          </li>
          <li>
            <b>Shop Pay,</b> an accelerated checkout option that securely saves
            your details for faster future purchases.
          </li>
          <li>
            <b>Apple Pay and Google Pay,</b> enabling one-touch mobile payments
            through your smartphone or device.
          </li>
          <li>
            <b>Klarna and Afterpay,</b> which offer buy-now-pay-later options so
            you can spread out the cost over time with no hidden fees.
          </li>
        </ul>
        <p>
          Each payment method is processed securely using encryption and fraud
          protection tools, so you can shop with complete peace of mind.
        </p>
      </div>
    ),
  },
  {
    label: "Buy Now, Pay Later with Klarna and Afterpay",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          We understand that investing in fine jewelry is a personal decision,
          and sometimes it&#39;s easier to manage when payments are divided over
          time. That’s why we’ve partnered with <b>Klarna </b> and{" "}
          <b>Afterpay</b>, two leading providers of flexible financing.
        </p>
        <p>With these services, you can:</p>
        <ul className="ps-5 list-disc">
          <li>
            Split your purchase into <b>4 interest-free payments</b>,
            automatically billed every two weeks.
          </li>
          <li>
            Enjoy the freedom of <b>no hard credit checks</b> and{" "}
            <b>no additional fees</b> as long as payments are made on time.
          </li>
          <li>
            Instantly get approved at checkout without lengthy application
            processes.
          </li>
        </ul>
        <p>
          Selecting Klarna or Afterpay is simple—just choose your preferred
          option during checkout, complete a quick setup, and finalize your
          order with confidence.
        </p>
      </div>
    ),
  },
  {
    label: "Transparent and Easy Financing",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          There are no hidden costs or confusing terms when using our financing
          options. You’ll see the full breakdown of your installment plan,
          including payment amounts and due dates, before you complete your
          order. As long as payments are made on time, you will never be charged
          interest or late fees. It’s our way of helping you enjoy your jewelry
          now while paying at a pace that works for you.
        </p>
      </div>
    ),
  },
  {
    label: "Safe and Secure Checkout",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At Katanoff, we take your security seriously. Every transaction on our
          site is protected by advanced encryption technology and
          industry-standard safeguards. Your personal and payment information is
          never shared, sold, or stored without your consent. We continuously
          monitor our systems to ensure a safe shopping experience every time
          you visit.
        </p>
      </div>
    ),
  },
  {
    label: "Questions or Assistance?",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          If you have any questions about payment options, need help choosing a
          financing plan, or experience any issues during checkout, our customer
          support team is always here to help. We’re happy to walk you through
          your options so that you feel confident and informed every step of the
          way.
        </p>
      </div>
    ),
  },
];

const PaymentAndFinancing = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Payment And Financing"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <AccordionTabs
          tabs={PaymentFinancingContent}
          defaultOpenLabel="Flexible Payment Options"
          forceResetKey="payment-financing"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default PaymentAndFinancing;
