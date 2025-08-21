import { setShowModal } from "@/store/slices/commonSlice";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import CancelReturnRequestModel from "./CancelReturnRequestModel";
import { setReturnOrder } from "@/store/slices/returnSlice";

export default function CancelReturnRequest({ returnId }) {
  const { showModal } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  const openCancelOrderModal = (returnId) => {
    dispatch(setShowModal(true));
    dispatch(setReturnOrder(returnId));
  };
  return (
    <div className="h-6 w-6 flex items-center justify-center bg-[#DC3545] rounded-full cursor-pointer">
      <RxCross2
        title="Cancel Return Request"
        className={`text-lg !text-white`}
        onClick={() => openCancelOrderModal(returnId)}
      />
      {showModal ? <CancelReturnRequestModel /> : null}
    </div>
  );
}
