"use client";
import { fetchOrderHistory } from "@/_actions/order.action";
import { helperFunctions, messageType } from "@/_helper";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import {
  setCurrentPage,
  setOrderMessage,
  setSelectedOrder,
} from "@/store/slices/orderSlice";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrderLoading } from "../../../store/slices/orderSlice";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import { setShowModal } from "@/store/slices/commonSlice";
import Alert from "@/components/ui/Alert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import returnRequestSvg from "@/assets/icons/returnRequest.svg";
import { CustomImg } from "@/components/dynamiComponents";
import threeDots from "@/assets/icons/3dots.svg";
import eye from "@/assets/icons/eye.svg";

// Import Floating UI
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import {
  useClick,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";
import CommonNotFound from "@/components/ui/CommonNotFound";
import { RxCross2 } from "react-icons/rx";
import CancelOrderModal from "@/components/ui/order-history/OrderCancelModel";

export default function OrderHistoryPage() {
  // In your main file (above the return)
  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);
  const { showModal } = useSelector(({ common }) => common);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    orderList,
    orderLoading,
    currentPage,
    selectedOrder,
    invoiceLoading,
    orderMessage,
  } = useSelector(({ order }) => order);

  useAlertTimeout(orderMessage, () =>
    dispatch(setOrderMessage({ message: "", type: "" }))
  );

  const loadData = useCallback(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const pageCount = Math.ceil(orderList?.length / ITEMS_PER_PAGE);
  const paginatedOrder = orderList?.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageClick = ({ selected }) => {
    dispatch(setCurrentPage(selected));
  };

  useEffect(() => {
    dispatch(setShowModal(false));
    loadData();
  }, [loadData]);

  useEffect(() => {
    return () => {
      dispatch(setOrderLoading(false));
    };
  }, []);

  const { refs, floatingStyles, context } = useFloating({
    open: openId !== null,
    onOpenChange: (open) => {
      if (!open) setOpenId(null);
    },
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: "start",
      }),
      shift({ padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const handleActionClick = (orderId, event) => {
    event.stopPropagation();
    if (openId === orderId) {
      setOpenId(null);
    } else {
      setOpenId(orderId);
      // Set the reference element for floating UI
      refs.setReference(event.currentTarget);
    }
  };

  const renderTableHeading = () => {
    return (
      <thead className="text-xs lg:text-sm text-basegray uppercase bg-[#00000005]">
        <tr>
          <th scope="col" className="px-6 py-3.5">
            Order Date
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Number
          </th>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Total
          </th>
          {/* <th scope="col" className="px-6 py-3.5">
            Payment Status
          </th> */}
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Order Status
          </th>
          <th scope="col" className="px-3 py-3.5 whitespace-nowrap">
            Action
          </th>
        </tr>
      </thead>
    );
  };

  return (
    <>
      {orderMessage?.type === messageType.SUCCESS && (
        <Alert message={orderMessage.message} type={orderMessage.type} />
      )}
      <div className="sm:pt-12 pt-2">
        <CommonBgHeading
          title="Order History"
          titleClassName="!text-[26px] md:!text-3xl"
        />
      </div>
      <div className="container my-10 relative overflow-x-auto pb-4">
        {orderLoading ? (
          <div className={`w-full h-[300px] animate-pulse`}>
            <table className="w-full text-sm text-left rtl:text-right">
              {renderTableHeading()}

              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className="bg-white border-b border-gray-200"
                  >
                    {[...Array(5)].map((_, colIndex) => (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="px-6 py-4"
                      >
                        <SkeletonLoader height="h-4 2xl:h-6" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : paginatedOrder?.length > 0 ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg">
            {renderTableHeading()}
            <tbody>
              {paginatedOrder?.map((order, index) => (
                <tr
                  key={`order-${index}`}
                  className="bg-white border-b border-gray-200 text-baseblack"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {order?.createdDate
                      ? moment(order?.createdDate).format("DD-MM-YYYY")
                      : null}
                  </th>
                  <td className="px-6 py-4">{order?.orderNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $ {helperFunctions?.toFixedNumber(order?.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {helperFunctions?.capitalizeCamelCase(order?.orderStatus)}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      {...getReferenceProps()}
                      onClick={(e) => handleActionClick(order.id, e)}
                      className="p-2 rounded"
                      aria-haspopup="true"
                      title="More Actions"
                    >
                      <CustomImg
                        srcAttr={threeDots}
                        altAttr="More"
                        className="w-4 h-4"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <CommonNotFound
            message="Sorry, No order Found"
            subMessage=""
            showButton={true}
          />
        )}
        {openId !== null && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-50 py-2 w-48 bg-[#FAFAF8] filter drop-shadow-lg"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4"
              onClick={() => {
                router.push(`/order-history/${openId}`);
                setOpenId(null);
              }}
            >
              <CustomImg srcAttr={eye} altAttr="View" className="w-6 h-6" />
              <p className="text-base text-basegray">View</p>
            </button>

            {(() => {
              const currentOrder = paginatedOrder?.find(
                (order) => order.id === openId
              );
              return (
                <>
                  {["pending", "confirmed"].includes(
                    currentOrder?.orderStatus
                  ) &&
                    currentOrder?.paymentStatus === "success" && (
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
                        onClick={() => {
                          dispatch(setShowModal(true));
                          dispatch(setSelectedOrder(openId));
                          setOpenId(null); // Close dropdown
                        }}
                      >
                        <RxCross2
                          title="Cancel Order"
                          className={`text-xl text-[#DC3545]`}
                        />
                        Cancel
                      </button>
                    )}

                  {currentOrder?.orderStatus === "delivered" &&
                    helperFunctions.isReturnValid(currentOrder?.deliveryDate) &&
                    currentOrder?.hasActiveReturns && (
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4"
                        onClick={() => {
                          router.push(`/return-request/${openId}`);
                          setOpenId(null);
                        }}
                      >
                        <CustomImg
                          srcAttr={returnRequestSvg}
                          altAttr="Return"
                          className="w-6 h-6"
                        />
                        <p className="text-base text-basegray">
                          Return Request
                        </p>
                      </button>
                    )}

                  {invoiceLoading && openId === selectedOrder ? (
                    <div className="px-4 py-2">Loading invoice...</div>
                  ) : (
                    <div className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray">
                      <DownloadInvoice
                        orderId={openId}
                        onSuccess={() => setOpenId(null)}
                      />
                      Download
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}
        {showModal && <CancelOrderModal />}
      </div>
      {!orderLoading && orderList?.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
    </>
  );
}
