import { setShowModal } from "@/store/slices/commonSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import CancelReturnRequestModel from "./CancelReturnRequestModel";
import { setReturnOrder } from "@/store/slices/returnSlice";

export default function CancelReturnRequest({ returnId }) {
  const { showModal } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const openCancelOrderModal = (returnId) => {
    dispatch(setShowModal(true));
    dispatch(setReturnOrder(returnId));
  };
  return (
    <>
      <RxCross2
        title="Cancel Order"
        className={`cursor-pointer text-xl !text-[#DC3545]`}
        onClick={() => openCancelOrderModal(returnId)}
      />
      {showModal ? <CancelReturnRequestModel /> : null}
    </>
  );
}
