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
import { useCallback, useEffect } from "react";
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

export default function ReturnHistoryPage() {
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

  const renderTableHeading = () => {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-[#0000000D] dark:text-gray-400">
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

      <div className="container my-10 relative overflow-x-auto">
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

                  <td className="px-6 py-4">
                    <CustomBadge status={order?.returnPaymentStatus}>
                      {order?.returnPaymentStatus}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <CustomBadge status={order?.status}>
                      {order?.status}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <IoEyeSharp
                        title="Return Detail"
                        className="cursor-pointer text-xl text-basegray"
                        onClick={() =>
                          router.push(`/return-history/${order.id}`)
                        }
                      />

                      {order.status === "pending" &&
                      order.returnPaymentStatus === "pending" ? (
                        <>
                          <CancelReturnRequest returnId={order.id} />
                        </>
                      ) : null}
                    </div>
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
