import { customJewelryService } from "../_services/customJewelry.service";
import { messageType } from "@/_helper/constants";
import { setCustomJewelryLoading, setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";

export const getCustomJewelry = (payload) => async (dispatch) => {
    try {
        dispatch(setCustomJewelryLoading(true));
        const res = await customJewelryService.addNewCustomJewelryRequest(payload);
        if (res) {
            dispatch(setCustomJewelryMessage({ message: "Success! Your custom jewelry request has been received", type: messageType.SUCCESS }));
            dispatch(setCustomJewelryLoading(false));
            return res;
        }
    } catch (e) {
        dispatch(setCustomJewelryLoading(false));
        dispatch(setCustomJewelryMessage({ message: e.message, type: messageType.ERROR }));
        return false;
    }
};