"use client";
import { useFormik } from "formik";
import * as Yup from "yup";

import { fetchOrderDetailByOrderNumber } from "@/_actions/return.action";
import {
  setReturnMessage,
  setSelectedProducts,
} from "@/store/slices/returnSlice";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const ReturnRequestPage = () => {
  let { orderNumber } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(() => {
    dispatch(setSelectedProducts([]));
    dispatch(setReturnMessage({ message: "", type: "" }));
    dispatch(fetchOrderDetailByOrderNumber(orderNumber));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const { orderDetail, detailLoader, returnReqLoader, returnMessage } =
    useSelector((returns) => returns);

  return <div>ReturnRequestPage</div>;
};

export default ReturnRequestPage;
