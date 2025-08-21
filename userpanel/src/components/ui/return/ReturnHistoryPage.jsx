"use client";
import { messageType } from "@/_helper";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowModal } from "@/store/slices/commonSlice";
import FixedAlert from "@/components/ui/FixedAlert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import {
  // downloadReturnInvoice,
  fetchReturnsHistory,
} from "@/_actions/return.action";
import {
  setCurrentPage,
  setReturnLoader,
  setReturnMessage,
  setReturnOrder,
} from "@/store/slices/returnSlice";
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
import CommonNotFound from "../CommonNotFound";
import { RxCross2 } from "react-icons/rx";
import CancelReturnRequestModel from "./CancelReturnRequestModel";
import DownloadInvoice from "../order-history/downloadInvoice";
// import { BsDownload } from "react-icons/bs";
import Spinner from "../spinner";

export default function ReturnHistoryPage() {
  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);
  const { showModal } = useSelector(({ common }) => common);

  const router = useRouter();
  const dispatch = useDispatch();
  const { invoiceLoading } = useSelector(({ order }) => order);
  const { returnOrder, returnMessage, returnsList, currentPage, returnLoader } =
    useSelector(({ returns }) => returns);
  useAlertTimeout(returnMessage, () =>
    dispatch(setReturnMessage({ message: "", type: "" }))
  );
  const loadData = useCallback(() => {
    dispatch(fetchReturnsHistory());
  }, [dispatch]);

  const pageCount = Math.ceil(returnsList.length / ITEMS_PER_PAGE);
  const paginatedReturnsList = returnsList.slice(
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
      dispatch(setReturnLoader(false));
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleActionClick = (returnOrderId, event) => {
    event.stopPropagation();
    if (openId === returnOrderId) {
      setOpenId(null);
    } else {
      setOpenId(returnOrderId);
      refs.setReference(event.currentTarget);
    }
  };

  // const handleDownloadInvoice = async ({ returnId, orderNumber }) => {
  //   if (!returnId) return;
  //   const response = await dispatch(
  //     downloadReturnInvoice({ returnId, orderNumber })
  //   );
  //   if (response) {
  //     setOpenId(null);
  //   }
  // };

  const renderTableHeading = () => {
    return (
      <thead className="text-xs lg:text-sm text-basegray capitalize bg-[#0000000D] dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Request Date
          </th>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Order Number
          </th>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Return Payment Status
          </th>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Return Status
          </th>
          <th scope="col" className="px-6 py-3.5 whitespace-nowrap">
            Action
          </th>
        </tr>
      </thead>
    );
  };
  return (
    <div>
      {returnMessage?.type === messageType.SUCCESS && (
        <FixedAlert message={returnMessage.message} type={returnMessage.type} />
      )}

      <div className="container mt-10">
        {returnLoader ? (
          <div className={`w-full h-[300px] animate-pulse`}>
            <table className="w-full text-sm text-left rtl:text-right shadow-[0px_0px_12px_0px_#0000001A]">
              {renderTableHeading()}

              <tbody>
                {[...Array(6)].map((_, rowIndex) => (
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
        ) : paginatedReturnsList?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400  shadow-lg">
              {renderTableHeading()}
              <tbody>
                {paginatedReturnsList.map((returnOrderItem, index) => (
                  <tr
                    key={`returnOrderItem-${index}`}
                    className="bg-white border-b border-gray-200 text-baseblack font-medium"
                  >
                    <th
                      scope="row"
                      className="px-6 py-2.5 font-medium whitespace-nowrap"
                    >
                      {returnOrderItem.createdDate
                        ? moment(returnOrderItem.createdDate).format(
                            "DD-MM-YYYY"
                          )
                        : null}
                    </th>
                    <td className="px-6 py-2.5">
                      {returnOrderItem.orderNumber}
                    </td>
                    <td className="px-6 py-2.5 capitalize">
                      {returnOrderItem?.returnPaymentStatus}
                    </td>
                    <td className="px-6 py-2.5 capitalize">
                      {returnOrderItem?.status}
                    </td>

                    <td className="px-3 py-2.5">
                      <button
                        {...getReferenceProps()}
                        onClick={(e) =>
                          handleActionClick(returnOrderItem.id, e)
                        }
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
            message="Sorry, No Return Found"
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
            className="z-40 min-w-44 w-fit bg-[#FAFAF8]"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4"
              onClick={() => {
                router.push(`/return-history/${openId}`);
                setOpenId(null);
              }}
            >
              <CustomImg srcAttr={eye} altAttr="View" className="w-6 h-6" />
              <p className="text-base text-basegray">View</p>
            </button>

            {(() => {
              const currentrReturnOrder = paginatedReturnsList?.find(
                (returnOrder) => returnOrder.id === openId
              );

              return (
                <>
                  {currentrReturnOrder?.status === "pending" &&
                    currentrReturnOrder?.returnPaymentStatus === "pending" && (
                      <button
                        className="w-full text-left px-4 py-2 text-[#DC3545] hover:bg-gray-100 flex gap-4 text-base items-center"
                        onClick={() => {
                          dispatch(setShowModal(true));
                          dispatch(setReturnOrder(openId));
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

                  {["approved", "received"]?.includes(
                    currentrReturnOrder?.status
                  ) &&
                    (invoiceLoading &&
                    currentrReturnOrder?.id === returnOrder ? (
                      <div className="flex px-4 py-2 gap-4 text-basegray">
                        <Spinner className="h-6" />
                        Exporting...
                      </div>
                    ) : (
                      <div
                        className={`w-full text-left  hover:bg-gray-100 flex gap-4 text-base text-basegray ${
                          invoiceLoading
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <DownloadInvoice
                          returnId={currentrReturnOrder?.id}
                          onSuccess={() => setOpenId(null)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
                        >
                          Download
                        </DownloadInvoice>
                      </div>

                      // <button
                      //   className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray"
                      //   onClick={() =>
                      //     handleDownloadInvoice({
                      //       returnId: currentrReturnOrder?.id,
                      //       orderNumber: currentrReturnOrder?.orderNumber,
                      //     })
                      //   }
                      // >
                      //   <BsDownload
                      //     title="Download Invoice"
                      //     className="text-xl text-basegray"
                      //   />
                      //   Download
                      // </button>
                    ))}
                </>
              );
            })()}
          </div>
        )}
        {showModal && <CancelReturnRequestModel />}
      </div>
      {!returnLoader && returnsList.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
    </div>
  );
}
