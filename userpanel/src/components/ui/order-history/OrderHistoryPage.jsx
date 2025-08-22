"use client";
// import {
//   downloadOrderInvoice,
//   fetchOrderHistory,
// } from "@/_actions/order.action";
import { helperFunctions, messageType } from "@/_helper";
import { fetchOrderHistory } from "@/_actions/order.action";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
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
import { setShowModal } from "@/store/slices/commonSlice";
import FixedAlert from "@/components/ui/FixedAlert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import returnRequestSvg from "@/assets/icons/returnRequest.svg";
import { CustomImg } from "@/components/dynamiComponents";
import threeDots from "@/assets/icons/3dots.svg";
import eye from "@/assets/icons/eye.svg";
// import { BsDownload } from "react-icons/bs";

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
import Spinner from "@/components/ui/spinner";

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

  // const handleDownloadInvoice = async (orderNumber) => {
  //   if (!orderNumber) return;
  //   const response = await dispatch(downloadOrderInvoice(orderNumber));
  //   if (response) {
  //     setOpenId(null);
  //   }
  // };

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
      <thead className="text-xs lg:text-sm text-basegray capitalize bg-[#0000000D] dark:text-gray-400">
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
        <FixedAlert message={orderMessage.message} type={orderMessage.type} />
      )}
      <div className="sm:pt-12 pt-2">
        <CommonBgHeading
          title="Order History"
          titleClassName="!text-[26px] md:!text-3xl"
        />
      </div>
      <div className="container mt-10">
        {orderLoading ? (
          <div className={`w-full h-[300px] animate-pulse`}>
            <table className="w-full text-sm text-left rtl:text-right shadow-[0px_0px_12px_0px_#0000001A]">
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 shadow-lg">
              {renderTableHeading()}
              <tbody>
                {paginatedOrder?.map((order, index) => (
                  <tr
                    key={`order-${index}`}
                    className="bg-white border-b border-gray-200 text-baseblack font-medium"
                  >
                    <th
                      scope="row"
                      className="px-6 py-2.5 font-medium whitespace-nowrap"
                    >
                      {order?.createdDate
                        ? moment(order?.createdDate).format("DD-MM-YYYY")
                        : null}
                    </th>
                    <td className="px-6 py-2.5">{order?.orderNumber}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      $ {helperFunctions?.toFixedNumber(order?.total)}
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      {helperFunctions?.capitalizeCamelCase(order?.orderStatus)}
                    </td>

                    <td className="px-3 py-2.5">
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
                          className="w-6 h-6"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            style={{
              ...floatingStyles,
              boxShadow: "0px 0px 12px 0px #0000001A",
            }}
            {...getFloatingProps()}
            className="z-40 py-2 min-w-44 w-fit bg-[#FAFAF8] rounded-lg"
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
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#DC3545] flex items-center gap-4 text-base"
                        onClick={() => {
                          dispatch(setShowModal(true));
                          dispatch(setSelectedOrder(openId));
                          setOpenId(null);
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
                    <div className="flex  px-4 py-2 gap-2 text-basegray">
                      <Spinner className="h-6" />
                      Exporting...
                    </div>
                  ) : (
                    <>
                      <div
                        className={`w-full text-left hover:bg-gray-100 flex gap-4 text-base text-basegray   ${
                          invoiceLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <DownloadInvoice
                          orderId={openId}
                          onSuccess={() => setOpenId(null)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
                        >
                          Download
                        </DownloadInvoice>
                      </div>
                      {/* <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
                      onClick={() =>
                        handleDownloadInvoice(currentOrder?.orderNumber)
                      }
                    >
                      <BsDownload
                        title="Download Invoice"
                        className="text-xl text-basegray"
                      />
                      Download
                    </button> */}
                    </>
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
