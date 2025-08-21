"use client";
import { fetchReturnDetail } from "@/_actions/return.action";
import { messageType } from "@/_helper";
import { ReturnDetails } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import FixedAlert from "@/components/ui/FixedAlert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { setShowModal } from "@/store/slices/commonSlice";
import { setReturnMessage } from "@/store/slices/returnSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReturnDetailPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { returnId } = params;

  const { returnDetail, returnLoader, returnMessage } = useSelector(
    ({ returns }) => returns
  );
  const { invoiceLoading } = useSelector(({ order }) => order);

  useAlertTimeout(returnMessage, () =>
    dispatch(setReturnMessage({ message: "", type: "" }))
  );

  useEffect(() => {
    dispatch(setShowModal(false));
    dispatch(fetchReturnDetail(returnId));
  }, [returnId]);
  return (
    <>
      {returnMessage?.type === messageType.SUCCESS && (
        <FixedAlert message={returnMessage.message} type={returnMessage.type} />
      )}
      <div className="pt-4 pb-8 md:py-12">
        <CommonBgHeading title="Return Summary" />
      </div>
      <div className="container">
        <ReturnDetails
          returnDetail={returnDetail}
          returnLoader={returnLoader}
          invoiceLoading={invoiceLoading}
          showCancel={true}
        />
      </div>
    </>
  );
};
export default ReturnDetailPage;
