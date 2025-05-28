import { fetchInvoiceOrderDetail } from "@/_actions/order.action";
import { generatePDF } from "@/_helper";
import { setSelectedOrder } from "@/store/slices/orderSlice";
import React, { useCallback } from "react";
import { BsDownload } from "react-icons/bs";
import { useDispatch } from "react-redux";

export default function DownloadInvoice({ orderId }) {
  const dispatch = useDispatch();

  const downloadInvoiceHandler = useCallback(
    async (orderId) => {
      dispatch(setSelectedOrder(orderId));

      const orderDetail = await dispatch(fetchInvoiceOrderDetail(orderId));
      if (orderDetail) {
        generatePDF(orderDetail);
      }
    },
    [dispatch]
  );

  return (
    <BsDownload
      title="Download Invoice"
      className="cursor-pointer text-xl text-basegray"
      onClick={() => downloadInvoiceHandler(orderId)}
    />
  );
}
