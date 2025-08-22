"use client";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductNotFound from "@/components/shop/productNotFound";
import { setShowModal } from "@/store/slices/commonSlice";
import OrderDetails from "@/components/ui/order-history/OrderDetail";
import { setOrderMessage } from "@/store/slices/orderSlice";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { messageType } from "@/_helper";
import FixedAlert from "@/components/ui/FixedAlert";
import { fetchOrderDetail } from "@/_actions/order.action";

export default function OrderDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { orderId } = params;
  const { orderMessage, orderDetail, orderDetailLoading } = useSelector(
    ({ order }) => order
  );

  useAlertTimeout(orderMessage, () =>
    dispatch(setOrderMessage({ message: "", type: "" }))
  );

  useEffect(() => {
    dispatch(setShowModal(false));
    dispatch(fetchOrderDetail(orderId));
  }, [orderId]);
  return (
    <>
      {orderMessage?.type === messageType.SUCCESS && (
        <FixedAlert message={orderMessage.message} type={orderMessage.type} />
      )}
      <div className="pt-4 pb-8 md:py-12">
        <CommonBgHeading title="Order Summary" />
      </div>

      {!orderDetail && !orderDetailLoading ? (
        <ProductNotFound message="Sorry, no order found." />
      ) : (
        <div className="container">
          <OrderDetails
            orderLoading={orderDetailLoading}
            orderDetail={orderDetail}
            showInvoice={true}
            showCancel={true}
          />
        </div>
      )}
    </>
  );
}
