import downloadIcon from "@/assets/icons/download.svg";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback } from "react";
import { downloadReturnInvoice } from "@/_actions/return.action";
import { downloadOrderInvoice } from "@/_actions/order.action";
import CustomImg from "../custom-img";

export default function DownloadInvoice({
  orderId,
  returnId,
  orderNumber,
  onSuccess,
  className = "",
  children,
  onClick,
}) {
  const dispatch = useDispatch();
  const { invoiceLoading } = useSelector(({ order }) => order);

  const downloadInvoiceHandler = useCallback(async () => {
    if (invoiceLoading) return;
    onClick?.();
    let response;
    if (returnId) {
      response = await dispatch(
        downloadReturnInvoice({ returnId, orderNumber })
      );
    } else if (orderId) {
      response = await dispatch(downloadOrderInvoice({ orderNumber }));
    }
    if (response) {
      onSuccess?.();
    }
  }, [dispatch, returnId, orderId, orderNumber, invoiceLoading, onSuccess]);

  return (
    <div
      className={`cursor-pointer flex items-center gap-2  ${className} ${invoiceLoading ? "opacity-50 cursor-not-allowed" : ""
        } ${children ? "hover:bg-gray-100" : ""}`}
      onClick={downloadInvoiceHandler}
    >
      <CustomImg
        srcAttr={downloadIcon}
        title={returnId ? "Download Return Invoice" : "Download Order Invoice"}
        className="w-[24px] cursor-pointer"
      />
      {children}
    </div>
  );
}
