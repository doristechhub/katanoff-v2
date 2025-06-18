import { AccordionTabs } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const shipingPolicyContent = [
  {
    label: "Free Shipping on Every Order",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At <b>Katanoff</b>, we’re committed to providing an exceptional
          shopping experience from start to finish. That’s why we offer{" "}
          <b>free shipping on all orders,</b> no minimum required. Whether
          you’re shopping for a gift or treating yourself, your jewelry will
          arrive safely, securely, and at no extra cost to you.
        </p>
      </div>
    ),
  },
  {
    label: "Fast, Free, and Insured",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Every Katanoff order ships
          <b> free of charge</b> and includes <b>insurance and tracking</b> for
          your peace of mind. We work with trusted carriers such as <b>FedEx</b>{" "}
          and <b>UPS</b> to ensure that your package arrives securely and on
          time. Once your order ships, you’ll receive tracking information via
          email so you can follow your delivery every step of the way.
        </p>
        <p>
          All packages require a <b>signature upon delivery</b>, helping ensure
          that your fine jewelry is placed in the right hands.
        </p>
      </div>
    ),
  },
  {
    label: "Shipping Within the United States",
    content: (
      <div className="flex flex-col gap-3">
        <ul className="ps-5 list-disc">
          <li>
            <b>Standard Shipping</b> (Free): Orders typically ship within{" "}
            <b>3–7 business days,</b> depending on the item.
          </li>
          <li>
            <b>Expedited Shipping:</b> Need it sooner? Expedited options may be
            available at checkout for an additional cost.
          </li>
          <li>
            All shipments are <b>fully insured</b> and require a{" "}
            <b>signature upon delivery.</b>
          </li>
          <li>
            We do not ship to <b>PO Boxes</b> or <b>APO/FPO</b> addresses at
            this time.
          </li>
        </ul>
        <p>
          Please note that delivery timelines may vary depending on product
          availability, customization, and your location. You&#39;ll receive
          email updates along the way.
        </p>
      </div>
    ),
  },
  {
    label: "Made-to-Order & Custom Pieces",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          Many of our items are handcrafted or made to order, which may require
          a bit more time before shipping. If your item is custom or
          personalized, we’ll clearly communicate the estimated production and
          delivery timelines during checkout.
        </p>
        <p>
          If you're placing a custom order with a specific deadline in mind
          (e.g., a gift or special occasion), feel free to reach out to our team
          in advance—we’ll do our best to meet your timeline.
        </p>
      </div>
    ),
  },
  {
    label: "International Shipping",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          At this time, Katanoff <b>only ships within the United States.</b> We
          are working to expand our shipping options internationally in the near
          future. If you are located outside the U.S. and would like to place an
          order, please contact us for possible solutions.
        </p>
      </div>
    ),
  },
  {
    label: "Order Updates & Support",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          As soon as your order ships, you’ll receive an email with tracking
          details. If you have any questions about your order status, shipping
          timeline, or delivery, our customer service team is here to help.
        </p>
      </div>
    ),
  },
];

const ShippingPolicy = () => {
  return (
    <div className="flex flex-col">
      <div className="pt-10 md:pt-14">
        <CommonBgHeading
          title="Shipping Policy"
          breadcrumb={true}
          titleClassName="uppercase"
        />
      </div>
      <div className="container mt-4 sm:mt-10">
        <AccordionTabs
          tabs={shipingPolicyContent}
          defaultOpenLabel="Free Shipping on Every Order"
          forceResetKey="shipping policy"
          contentCustomClass="md:text-lg !ps-5"
        />
      </div>
    </div>
  );
};

export default ShippingPolicy;
