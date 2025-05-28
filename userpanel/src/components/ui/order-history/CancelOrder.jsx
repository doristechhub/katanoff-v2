import { setShowModal } from "@/store/slices/commonSlice";
import { setSelectedOrder } from "@/store/slices/orderSlice";
import CancelOrderModel from "@/components/ui/order-history/OrderCancelModel";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

export default function CancelOrder({ orderId }) {
  const { showModal } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const openCancelOrderModal = (orderId) => {
    dispatch(setShowModal(true));
    dispatch(setSelectedOrder(orderId));
  };
  return (
    <>
      <RxCross2
        title="Cancel Order"
        className={`cursor-pointer text-xl !text-[#DC3545]`}
        onClick={() => openCancelOrderModal(orderId)}
      />
      {showModal ? <CancelOrderModel /> : null}
    </>
  );
}
