"use client";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useParams } from "next/navigation";
import { fetchOrderDetail } from "../../../../_actions/order.action";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import ProductNotFound from "@/components/shop/productNotFound";
import { setShowModal } from "@/store/slices/commonSlice";
import OrderDetails from "@/components/ui/OrderDetail";

export default function OrderDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { orderId } = params;
  const { orderDetail, orderDetailLoading, invoiceLoading, selectedOrder } =
    useSelector(({ order }) => order);

  useEffect(() => {
    dispatch(setShowModal(false));
    dispatch(fetchOrderDetail(orderId));
  }, [orderId]);
  return (
    <>
      <div className="pt-6 md:pt-12">
        <CommonBgHeading title="Order Summary" />
      </div>

      {!orderDetail && !orderDetailLoading ? (
        <ProductNotFound message="Sorry, no order found." />
      ) : (
        <div className="container">
          <OrderDetails
            orderLoading={orderDetailLoading}
            orderDetail={orderDetail}
            invoiceLoading={invoiceLoading}
            selectedOrder={selectedOrder}
            showInvoice={true}
          />
        </div>
      )}
    </>
  );
}
