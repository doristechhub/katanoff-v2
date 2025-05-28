"use client";
import { fetchOrderHistory } from "@/_actions/order.action";
import { helperFunctions, messageType } from "@/_helper";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import CustomBadge from "@/components/ui/CustomBadge";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import Spinner from "@/components/ui/spinner";
import { setCurrentPage, setOrderMessage } from "@/store/slices/orderSlice";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setOrderLoading } from "../../../store/slices/orderSlice";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import { setShowModal } from "@/store/slices/commonSlice";
import Alert from "@/components/ui/Alert";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import { TbTruckReturn } from "react-icons/tb";
import returnRequestSvg from "@/assets/icons/returnRequest.svg";
import { CustomImg } from "@/components/dynamiComponents";
export default function OrderHistoryPage() {
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

  const renderTableHeading = () => {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-[#0000000D] dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3.5">
            Order Date
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Number
          </th>
          <th scope="col" className="px-6 py-3.5">
            Total
          </th>
          <th scope="col" className="px-6 py-3.5">
            Payment Status
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Status
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
      {orderMessage?.type === messageType.SUCCESS && (
        <Alert message={orderMessage.message} type={orderMessage.type} />
      )}
      <CommonBgHeading title="Order History" />

      <div className="container my-10 relative overflow-x-auto">
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
                    {[...Array(6)].map((_, colIndex) => (
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
                  <td className="px-6 py-4">
                    $ {helperFunctions?.toFixedNumber(order?.total)}
                  </td>
                  <td className="px-6 py-4">
                    <CustomBadge status={order?.paymentStatus}>
                      {order?.paymentStatus}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <CustomBadge status={order?.orderStatus}>
                      {order?.orderStatus}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <IoEyeSharp
                        title="Order Detail"
                        className="cursor-pointer text-xl text-basegray"
                        onClick={() =>
                          router.push(`/order-history/${order?.id}`)
                        }
                      />

                      {["pending", "confirmed"].includes(order?.orderStatus) &&
                      order?.paymentStatus === "success" ? (
                        <CancelOrder orderId={order?.id} />
                      ) : null}

                      {["delivered"].includes(order?.orderStatus) &&
                      helperFunctions.isReturnValid(order?.deliveryDate) &&
                      order?.hasActiveReturns ? (
                        <CustomImg
                          srcAttr={returnRequestSvg}
                          altAttr="Return Request"
                          titleAttr="Return Request"
                          onClick={() =>
                            router.push(`/return-request/${order?.id}`)
                          }
                          className="cursor-pointer w-6 h-6"
                        />
                      ) : null}

                      {invoiceLoading && order?.id === selectedOrder ? (
                        <Spinner className="h-6" />
                      ) : (
                        <DownloadInvoice orderId={order?.id} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!orderLoading && orderList?.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
    </div>
  );
}
