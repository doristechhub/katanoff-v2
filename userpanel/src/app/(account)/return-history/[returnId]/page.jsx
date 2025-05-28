"use client";
import { fetchReturnDetail } from "@/_actions/return.action";
import { ReturnDetails } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { setShowModal } from "@/store/slices/commonSlice";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const ReturnDetailPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { returnId } = params;

  const { returnDetail, returnLoader } = useSelector(({ returns }) => returns);
  useEffect(() => {
    dispatch(setShowModal(false));
    dispatch(fetchReturnDetail(returnId));
  }, [returnId]);
  return (
    <>
      <CommonBgHeading title="Return Summary" />
      <ReturnDetails returnDetail={returnDetail} returnLoader={returnLoader} />;
    </>
  );
};
export default ReturnDetailPage;
