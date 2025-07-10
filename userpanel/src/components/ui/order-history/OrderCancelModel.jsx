"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";

import Modal from "../Modal";
import ErrorMessage from "../ErrorMessage";
import { GrayButton, LoadingPrimaryButton } from "../button";

import { setIsHovered, setShowModal } from "@/store/slices/commonSlice";
import { fetchOrderHistory, orderCancel } from "@/_actions/order.action";
import { messageType } from "@/_helper/constants";

export default function CancelOrderModal() {
  const dispatch = useDispatch();
  const { cancelOrderLoading, selectedOrder, orderMessage } = useSelector(
    ({ order }) => order
  );
  const { isHovered } = useSelector(({ common }) => common);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [dispatch]);

  const initialValues = {
    reason: "",
  };

  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .required("Reason is required")
      .min(5, "Reason must be at least 5 characters"),
  });

  const handleSubmit = async (values) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const payload = {
      orderId: selectedOrder,
      cancelReason: values.reason,
    };

    const response = await dispatch(
      orderCancel(payload, { signal: controller.signal })
    );
    if (response) {
      dispatch(setShowModal(false));
      dispatch(fetchOrderHistory());
    }
  };

  return (
    <Modal title="Cancel Order" titleClassName="!text-center" footer={null}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-lg font-semibold">
                Reason
              </label>
              <Field
                as="textarea"
                id="reason"
                name="reason"
                rows={4}
                placeholder="Enter cancellation reason..."
                className="mt-1 block w-full border border-[#DFDFDF] shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2"
              />
              <FormikErrorMessage
                name="reason"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {orderMessage?.type === messageType.ERROR && (
              <ErrorMessage message={orderMessage.message} className="mb-3" />
            )}

            <div className="flex gap-4">
              <GrayButton
                title="CANCEL"
                onClick={() => dispatch(setShowModal(false))}
              >
                Cancel
              </GrayButton>

              <div
                onMouseEnter={() => dispatch(setIsHovered(true))}
                onMouseLeave={() => dispatch(setIsHovered(false))}
              >
                <LoadingPrimaryButton
                  type="submit"
                  title="Confirm"
                  loading={cancelOrderLoading}
                  disabled={cancelOrderLoading || !isValid}
                  loaderType={isHovered ? "" : "white"}
                  className="uppercase"
                >
                  Confirm
                </LoadingPrimaryButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
