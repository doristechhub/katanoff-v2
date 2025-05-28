import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail, companyPhoneNo } from "@/_helper";

const privacySections = [
  {
    label: "How do I initiate a return?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            KatanOff offers multiple ways to initiate your return. We offer a
            free 30-day return privilege, which is calculated from the time that
            your order ships. Most items may be returned for a full refund back
            to your original form of payment. High Jewelry items, Special
            Orders, and Truly Custom items may be returned for store credit
            only.
          </p>
          <p>
            Account Holders: If you placed your order using your online account,
            log into your account and choose Order History. You can choose which
            orders and items you would like to return. This will track your
            return along with all orders you have placed.
          </p>
          <p>
            Guests: If you placed your order as a guest, you can enter your
            information to choose which items you would like to return.
          </p>
          <p>
            Contact Us: Contact a customer service agent via email at{" "}
            {companyEmail} or call us at {companyPhoneNo}.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "What is your return policy?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            At KatanOff, we currently offer a complimentary 30-day return policy
            with FREE return shipping via FedEx for all items. If for any reason
            you are not completely satisfied with your order, return it within
            30 days from when it ships. All pre-designed styles and Design Your
            Ring styles may be returned for a full refund to your original
            payment method.
          </p>
          <p>
            High Jewelry, Special Orders, and Truly Custom orders, can be
            returned for store credit only. Upon receipt of your return within
            the 30-day return period, we will issue a credit to your Katanoff
            account. Your credit will never expire, and can be used on any
            future purchases.
          </p>
          </div>
      </>
    ),
  },
  {
    label: "Can I re-size, repair or exchange my item instead of returning it?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            We utilize our repair process for many post-purchase processes:
            warranty claims, quality issues, ring sizing, or other issues. For
            this process, we send you a shipping label, repair work order, and
            instructions on how to ship the item to our repair facility. Once
            the repair or re-make is complete, we ship the item back to you via
            FedEx 2Day service. We cover the cost of the shipping to our repair
            facility and back to you when the work is complete.
          </p>
          <p>
            Not all situations will be able to utilize the repair process. For
            example, if you decide you want a larger carat weight or a different
            metal type, the item may need to be returned, and the new item
            re-ordered.
          </p>
          <p>
            Our agents can help advise you of the next steps for any of the
            above situations.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Can I return my item after the return date?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            Katanoff offers a generous, free, 30-day return policy, which is
            calculated from the time that your order ships. Unfortunately, we
            cannot accept return requests past this timeframe, and our agents
            are unable to issue refunds to your original payment method after 30
            days.
          </p>
          <p>
            For more information, please review our full return policy 
            <a href="/return-policy" className="underline">
              here
            </a>
            .
          </p>
        </div>
      </>
    ),
  },
];

const exchangeSections = [
  {
    label: "What is your exchange policy?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            We are unable to make exchanges at this time. However, we do have
            two process to help you ensure your jewelry is just right.
          </p>
          <p>
            Repair Process: For example, if you ordered a ring in the wrong size
            or a bracelet in the wrong length, or there is a different issue
            that you're experiencing, we may be able to repair or replace the
            item at no cost to you. If you would like to initiate the repair
            process, please provide your order name, order number, and details
            of the issue, and we will be happy to help.
          </p>
          <p>
            Free Returns: Second, you may also return your item within our
            return policy and place a new order for a new item. We offer free
            returns within 30 days from the date the item shipped. For more
            information about returns, including how to initiate a return,
            please visit our full return policy{" "}
            <a href="/return-policy" className="underline">
              here
            </a>
            .
          </p>
        </div>
      </>
    ),
  },
  {
    label:
      "Can I exchange my jewelry for a different metal type/color or different carat weight?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            We are unable to exchange items for different metal types and
            colors, or for different carat weights or qualities of diamonds.
            However, we do have two process to help you ensure that you get the
            jewelry you like.
          </p>
          <p>
            Repair Process: For example, if you ordered a ring in the wrong size
            or a bracelet in the wrong length, or there is a different issue
            that you're experiencing, we may be able to repair or replace the
            item at no cost to you. If you would like to initiate the repair
            process, please provide your order name, order number, and details
            of the issue, and we will be happy to help.
          </p>
          <p>
            Free Returns: Second, you may also return your item within our 30
            day return policy and place a new order for a new item. We offer
            free returns within 30 days from the date the item shipped. For more
            information about returns, including how to initiate a return,
            please visit our full return policy 
            <a href="/return-policy" className="underline">
              here
            </a>
            .
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Can I exchange my jewelry for a different size?",
    content: (
      <>
        <div className="flex flex-col gap-3">
          <p>
            Katanoff offers a free repair service to help ensure that you
            receive your item with the correct fit.
          </p>
          <p>
            For example, if you ordered a ring in the wrong size or a bracelet
            in the wrong length, or there is a different issue that you're
            experiencing, we may be able to repair or replace the item at no
            cost to you. We also offer free ring sizing once per year (excluding
            eternity-style rings) should you need it, as long as we can maintain
            the integrity of the ring.
          </p>
          <p>
            If you would like to initiate the repair process, please speak to a
            customer service representative.
          </p>
        </div>
      </>
    ),
  },
];

const ReturnPolicy = () => {
  return (
    <>
      <CommonBgHeading
        title="Return Policy"
        backText="Back To Home"
        backHref="/"
      />

      <div className="container normal-case mb-10">
       <h2 className="pl-4 lg:pl-0 text-lg xxs:text-2xl md:text-3xl xl:text-4xl text-baseblack font-castoro pt-8 xxs:pt-12 lg:pt-20">
          Returns Questions
        </h2>
 <div className="border-t border-t-grayborder mt-6 md:mt-10 lg:mt-12"/>
        <AccordionTabs
          tabs={privacySections}
          defaultOpenLabel="How do I initiate a return?"
          forceResetKey="return"
           contentCustomClass="md:text-lg"

        />

       <h2 className="pl-4 lg:pl-0 justify-center  text-lg xxs:text-2xl md:text-3xl xl:text-4xl text-baseblack font-castoro pt-8 xxs:pt-12 lg:pt-20">
          Exchange Questions
        </h2>

        <AccordionTabs
          tabs={exchangeSections}
          defaultOpenLabel="exchange policy"
          forceResetKey="exchange policy"
          contentCustomClass="md:text-lg"

        />
      </div>
    </>
  );
};

export default ReturnPolicy;
