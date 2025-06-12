import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { companyEmail, companyPhoneNo, companyUrl } from "@/_helper";
import { AccordionTabs } from "@/components/dynamiComponents";


const warrantySections = [
  {
    label: "Is a warranty included with my purchase?",
    content: (
      <>
        <p>
          KatanOff includes a Limited Lifetime Warranty with every jewelry purchase, regardless of price and type of item. We warrant that all
          jewelry purchased from our website will be free from manufacturing defects in materials and workmanship at the time of delivery and the
          optical properties of the lab grown diamonds will never fade or cloud over time. Other restrictions and exclusions apply.
        </p>
      </>
    ),
  },
  {
    label: "How do I report a warranty claim or quality issue?",
    content: (
      <>
        <p>
          For warranty claims or other quality-related issues, we will utilize our repair process to evaluate your jewelry and, if necessary, we may
          be able to repair or replace the item at no cost to you. To report a warranty claim or other quality issue, please contact a customer service agent via email at {companyEmail} or call us at {companyPhoneNo}.
        </p>
      </>
    ),
  },
  {
    label: "Can I purchase an Extended Service Plan?",
    content: (
      <>
        <div className="flex flex-col gap-y-3">
          <p>
            Yes! We offer Extended Service Plans from Extend. For all jewelry items, you can purchase this plan when you check out on the website.  Check the My Bag page, or the checkout page to see the available coverage options and prices.  Once you choose the coverage that is right for you, you can add the service plan to your order at checkout.
          </p>
          <p>
            Alternatively, you can add an Extended Service Plan for your items up to 30 days from when it ships.You may receive an email from
            Katanoff with instructions on how to add the service plan to your item. However, you can also log into your account
            at <a  href={`/auth/login`}><u>Login Here</u></a>, choose the item that you want to cover, and then purchase the Extended Service Plan. If you don't have an account created, you can also visit <a  href={`/auth/login`}className="underline"> {`${companyUrl}/auth/login`}</a> and then enter your order number and billing email address to find the item you want to cover, and then purchase the coverage. Please note that Extended Service Plans may only be purchased within 30 days from when your item has shipped. After 30 days, we no longer have the
            ability to add coverage to your items.
          </p>  
          <p>
            To learn more about Extended Service plans from Extend.
          </p>
        </div>
      </>
    ),
  },
];

const repairSections = [
  {
    label: "What is your repair process?",
    content: (
      <>
        <div className="flex flex-col gap-y-3">
          <p>
            We utilize our repair process for many post-purchase processes: warranty claims, quality issues, ring sizing, or other sizing issues. For this process, we send you a shipping label, repair work order, and instructions on how to ship the item to our repair facility. Once the repair or re-make is complete, we ship the item back to you via FedEx 2Day service. We cover the cost of the shipping to our repair facility and back to you when the work is complete.
          </p>
          <p>
            Not all situations will be able to utilize the repair process. For example, if you decide you want a larger carat weight or a different
            metal type, the item may need to be returned, and the new item re-ordered.
          </p>
          <p>
            Our agents can help advise you of the next steps for any of the above situations. To report a quality or sizing issue, please contact a customer service agent via email at {companyEmail} or call us at {companyPhoneNo}.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Can I have my ring re-sized?",
    content: (
      <>
        <div className="flex flex-col gap-y-3">
          <p>
            For U.S. customers, Katanoff offers one free ring sizing within 30 days of your purchase, and up to one time per year after that (excluding eternity-style rings), as long as we can maintain the quality of the ring. Eternity bands will need to be re-made in the correct size, which we offer one time only within 30 days of your purchase. In all cases, we utilize our repair process to receive and size or remake your ring.
          </p>
          <p>
            To request to have your ring re-sized, please contact a customer service agent via email at {companyEmail} or call us at {companyPhoneNo}.
          </p>
          <p>
            For International customers, you must return your item within the return policy, and re-purchase in the correct size. We do not offer
            free annual ring re-sizing on international orders.
          </p>
        </div>
      </>
    ),
  },
  {
    label: "Can I have my bracelet re-sized?",
    content: (
      <>
        <div className="flex flex-col gap-y-3">
          <p>
            For U.S. customers, some bracelets may be able to be re-sized and some may not. For example, if you ordered a tennis bracelet, and it is too long, it may be possible to remove links from your bracelet. For these instances, we will utilize our repair process for this. Our repair facility will remove the necessary links to achieve the nearest required length, and return the bracelet to you along with any links that were removed. This service is provided for 30 days after your purchase. If a bracelet is too short, we may need to have you return the bracelet, and re-order the correct length. We may also be able to process a new special order for you, if required. Some bracelets, like bangles or cuff bracelets, may not be re-sized at all. In all cases, our agents will be able to advise you on the next steps. Contact a customer service agent via email at {companyEmail} or call us at {companyPhoneNo}.
          </p>
          <p>
            For International customers, you must return your item, and re-purchase in the correct size.
          </p>
        </div>
      </>
    ), 
  },
];

const Warranty = () => {
  return (
<>
      <div className="pt-12 md:pt-16">
      <CommonBgHeading title="Warranty" 
      backText="Back To Home" 
      backHref="/" />
      </div>

      <div className="container normal-case mb-10">
       <h2 className="pl-4 lg:pl-0 text-lg xxs:text-2xl md:text-3xl xl:text-4xl text-baseblack font-castoro pt-8 xxs:pt-12 lg:pt-20">
          Warranty Questions
        </h2>
<div className="border-t border-t-grayborder mt-6 md:mt-10 lg:mt-12"/>
        <AccordionTabs
          tabs={warrantySections}
          defaultOpenLabel="Is a warranty included with my purchase?"
          forceResetKey="warranty"
          contentCustomClass="md:text-lg"
        />
  
        <h2 className="pl-4 lg:pl-0 text-4xl text-baseblack font-castoro mt-20 border-b border-grayborder pb-12">
          Repair Questions
        </h2>

        <AccordionTabs
          tabs={repairSections}
          defaultOpenLabel="repair"
          forceResetKey="repair"
          contentCustomClass="md:text-lg"
        />
      </div>
      </>
  );
};

export default Warranty;
