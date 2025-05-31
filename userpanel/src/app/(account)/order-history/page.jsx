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
import { useCallback, useEffect, useRef, useState } from "react";
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
import threeDots from "@/assets/icons/3dots.svg";
import deleteRed from "@/assets/icons/deleteRed.svg";
import eye from "@/assets/icons/eye.svg";
import download from "@/assets/icons/download.svg";
export default function OrderHistoryPage() {
  // In your main file (above the return)
  const [openId, setOpenId] = useState(null);
  const dropdownRef = useRef(null);

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

  const renderTableHeading = () => {
    return (
      <thead className="text-xs text-basegray uppercase bg-[#0000000D]">
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
          {/* <th scope="col" className="px-6 py-3.5">
            Payment Status
          </th> */}
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
      <div className="pt-12">
        <CommonBgHeading title="Order History" />
      </div>
      <div className="container my-10 relative">
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
                  <td className="px-6 py-4">{order?.orderStatus}</td>

                  {/* <div className="flex gap-3">
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
                    </div> */}
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
                            router.push(`/order-history/${order.id}`)
                          }
                        >
                          <CustomImg
                            srcAttr={eye}
                            altAttr="View"
                            className="w-6 h-6"
                          />
                          <p className="text-base text-basegray">View</p>
                        </button>

                        {["pending", "confirmed"].includes(order.orderStatus) &&
                          order.paymentStatus === "success" && (
                            <div className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray">
                              <CancelOrder orderId={order.id} /> Delete
                            </div>
                          )}

                        {order.orderStatus === "delivered" &&
                          helperFunctions.isReturnValid(order.deliveryDate) &&
                          order.hasActiveReturns && (
                            <button
                              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4"
                              onClick={() =>
                                router.push(`/return-request/${order.id}`)
                              }
                            >
                              <CustomImg
                                srcAttr={returnRequestSvg}
                                altAttr="View"
                                className="w-6 h-6"
                              />
                              <p className="text-base text-basegray">
                                {" "}
                                Return Order
                              </p>
                            </button>
                          )}

                        {invoiceLoading && order.id === selectedOrder ? (
                          <div className="px-4 py-2">Loading invoice...</div>
                        ) : (
                          <div className="w-full text-left px-4 py-2 hover:bg-gray-100 flex gap-4 text-base text-basegray">
                            <DownloadInvoice orderId={order?.id} /> Download
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
      {!orderLoading && orderList?.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
    </div>
  );
}
