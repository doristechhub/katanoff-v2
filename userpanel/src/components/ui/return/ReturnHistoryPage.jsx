"use client";
import { fetchOrderHistory } from "@/_actions/order.action";
import { helperFunctions, messageType } from "@/_helper";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import CustomBadge from "@/components/ui/CustomBadge";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import { setShowModal } from "@/store/slices/commonSlice";
import Alert from "@/components/ui/Alert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { fetchReturnsHistory } from "@/_actions/return.action";
import {
  setCurrentPage,
  setReturnLoader,
  setReturnMessage,
} from "@/store/slices/returnSlice";
import CancelReturnRequest from "./CancelReturnRequest";
import { CustomImg } from "@/components/dynamiComponents";
import threeDots from "@/assets/icons/3dots.svg";
import deleteRed from "@/assets/icons/deleteRed.svg";
import eye from "@/assets/icons/eye.svg";
import download from "@/assets/icons/download.svg";
export default function ReturnHistoryPage() {
  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { orderList, orderLoading, selectedOrder, orderMessage } = useSelector(
    ({ order }) => order
  );
  const { returnMessage, returnsList, currentPage, returnLoader } = useSelector(
    ({ returns }) => returns
  );
  useAlertTimeout(returnMessage, () =>
    dispatch(setReturnMessage({ message: "", type: "" }))
  );
  const loadData = useCallback(() => {
    dispatch(fetchReturnsHistory());
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const pageCount = Math.ceil(orderList.length / ITEMS_PER_PAGE);
  const paginatedOrder = returnsList.slice(
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

  const renderTableHeading = () => {
    return (
      <thead className="text-xs text-basegray uppercase bg-[#0000000D] dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3.5">
            Request Date
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Number
          </th>
          <th scope="col" className="px-6 py-3.5">
            Return Payment Status
          </th>
          <th scope="col" className="px-6 py-3.5">
            Return Status
          </th>
          <th scope="col" className="px-6 py-3.5">
            Action
          </th>
        </tr>
      </thead>
    );
  };
  return (
    <div>
      {returnMessage?.type === messageType.SUCCESS && (
        <Alert message={returnMessage.message} type={returnMessage.type} />
      )}

      <div className="container my-10 relative">
        {returnLoader ? (
          <div className={`w-full h-[300px] animate-pulse`}>
            <table className="w-full text-sm text-left rtl:text-right">
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
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {renderTableHeading()}
            <tbody>
              {paginatedOrder.map((order, index) => (
                <tr
                  key={`order-${index}`}
                  className="bg-white border-b border-gray-200 text-baseblack"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {order.createdDate
                      ? moment(order.createdDate).format("DD-MM-YYYY")
                      : null}
                  </th>
                  <td className="px-6 py-4">{order.orderNumber}</td>
                  <td className="px-6 py-4">{order?.returnPaymentStatus}</td>
                  <td className="px-6 py-4">{order?.status}</td>
                  <td className="px-6 py-4 relative">
                    <button
                      onClick={() =>
                        setOpenId(openId === order.id ? null : order.id)
                      }
                      className="p-2 rounded hover:bg-gray-100"
                      aria-haspopup="true"
                      title="More Actions"
                    >
                      <CustomImg
                        srcAttr={threeDots}
                        altAttr="More"
                        className="w-4 h-4"
                      />
                    </button>

                    {openId === order.id && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 z-50 mt-2 w-44 bg-white border border-gray-300 rounded shadow-lg"
                      >
                        <button
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4"
                          onClick={() =>
                            router.push(`/return-history/${order.id}`)
                          }
                        >
                          <CustomImg
                            srcAttr={eye}
                            altAttr="View"
                            className="w-6 h-6"
                          />
                          <p className="text-base text-basegray">View</p>
                        </button>

                        {order.status === "pending" &&
                          order.returnPaymentStatus === "pending" && (
                            <div className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray">
                              <CancelReturnRequest returnId={order.id} />
                              Delete
                            </div>
                          )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!returnLoader && returnsList.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
    </div>
  );
}
