import { fetchInvoiceOrderDetail } from "@/_actions/order.action";
import { fetchReturnInvoiceDetail } from "@/_actions/return.action";
import { generatePDF } from "@/_helper";
import { generateReturnPDF } from "@/_helper/generateReturnPdf";
import { CustomImg } from "@/components/dynamiComponents";
import downloadIcon from "@/assets/icons/download.svg";
import { setInvoiceLoading, setSelectedOrder } from "@/store/slices/orderSlice";
import { setReturnOrder } from "@/store/slices/returnSlice";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

export default function DownloadInvoice({
  orderId,
  returnId,
  onSuccess,
  className = "",
  children,
}) {
  const dispatch = useDispatch();

  const downloadInvoiceHandler = useCallback(async () => {
    if (returnId) {
      dispatch(setReturnOrder(returnId));
      const returnDetail = await dispatch(fetchReturnInvoiceDetail(returnId));
      if (returnDetail) {
        const response = await generateReturnPDF(returnDetail);
        if (response) {
          onSuccess?.();
        }
      }
      dispatch(setInvoiceLoading(false));
    } else if (orderId) {
      dispatch(setSelectedOrder(orderId));

      const orderDetail = await dispatch(fetchInvoiceOrderDetail(orderId));
      if (orderDetail) {
        const response = await generatePDF(orderDetail);
        if (response) {
          onSuccess?.();
        }
      }
      dispatch(setInvoiceLoading(false));
    }
  }, [dispatch, orderId, returnId, onSuccess]);

  if (children) {
    return (
      <div
        className={`cursor-pointer ${className}`}
        onClick={downloadInvoiceHandler}
      >
        <CustomImg
          srcAttr={downloadIcon}
          title={
            returnId ? "Download Return Invoice" : "Download Order Invoice"
          }
          className="cursor-pointer w-[24px]"
        />
        {children}
      </div>
    );
  }

  return (
    <CustomImg
      srcAttr={downloadIcon}
      title={returnId ? "Download Return Invoice" : "Download Order Invoice"}
      className="cursor-pointer w-[24px]"
      onClick={downloadInvoiceHandler}
    />
  );
}
