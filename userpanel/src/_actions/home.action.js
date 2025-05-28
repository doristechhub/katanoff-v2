import { getAllMenuData, getAllMenuList } from "@/_services";
import { setMenuList, setMenuLoading } from "@/store/slices/commonSlice";

export const getMenuList = () => async (dispatch) => {
    try {
        dispatch(setMenuLoading(true))
        const response = await getAllMenuList()
        if (response) {
            dispatch(setMenuList(response));
            dispatch(setMenuLoading(false))
        }
    } catch (e) {
        console.error(e);
    } finally {
        dispatch(setMenuLoading(false))
    }
};