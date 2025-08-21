import { setShowModal } from "@/store/slices/commonSlice";
import { setSelectedOrder } from "@/store/slices/orderSlice";
import CancelOrderModel from "@/components/ui/order-history/OrderCancelModel";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

export default function CancelOrder({ orderId }) {
  const { showModal } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const openCancelOrderModal = (orderId) => {
    dispatch(setShowModal(true));
    dispatch(setSelectedOrder(orderId));
  };
  return (
    <div className="h-6 w-6 flex items-center justify-center bg-[#DC3545] rounded-full cursor-pointer">
      <RxCross2
        title="Cancel Order"
        className={`text-lg !text-white`}
        onClick={() => openCancelOrderModal(orderId)}
      />
      {showModal ? <CancelOrderModel /> : null}
    </div>
  );
}
