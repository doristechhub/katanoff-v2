import { OrderSuccessfulPage } from "@/components/dynamiComponents";
import CheckoutBreadCrumbs from "@/components/ui/checkout/CheckoutBreadCrumbs";

const OrderSuccessful = () => {
  return (
    <div className="pt-28 lg:pt-12 2xl:pt-16">
      <div className="px-4 container">
        <CheckoutBreadCrumbs currentStep={3} />
      </div>

      <OrderSuccessfulPage />
    </div>
  );
};

export default OrderSuccessful;
