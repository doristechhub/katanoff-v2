import { fetchInvoiceOrderDetail } from "@/_actions/order.action";
import { fetchReturnInvoiceDetail } from "@/_actions/return.action";
import { generatePDF } from "@/_helper";
import { generateReturnPDF } from "@/_helper/generateReturnPdf";
import { setSelectedOrder } from "@/store/slices/orderSlice";
import React, { useCallback } from "react";
import { BsDownload } from "react-icons/bs";
import { useDispatch } from "react-redux";

export default function DownloadInvoice({ orderId, returnId }) {
  const dispatch = useDispatch();

  const downloadInvoiceHandler = useCallback(async () => {
    if (returnId) {
      const returnDetail = await dispatch(fetchReturnInvoiceDetail(returnId));
      if (returnDetail) generateReturnPDF(returnDetail);
    } else if (orderId) {
      dispatch(setSelectedOrder(orderId));

      const orderDetail = await dispatch(fetchInvoiceOrderDetail(orderId));
      if (orderDetail) generatePDF(orderDetail);
    }
  }, [dispatch, orderId, returnId]);

  return (
    <BsDownload
      title={returnId ? "Download Return Invoice" : "Download Order Invoice"}
      className="cursor-pointer text-xl text-basegray"
      onClick={downloadInvoiceHandler}
    />
  );
}
