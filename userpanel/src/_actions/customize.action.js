import { CATEGORIES, RING } from "@/_helper/constants";
import { productService } from "@/_services";
import { setCustomizeProductList, setCustomizeProductLoading, setUniqueFilterOptions } from "@/store/slices/productSlice";
import { getUniqueFilterOptions } from "./product.actions";
import { setCustomizeOptionLoading, setUniqueFilterOptionsForHeader } from "@/store/slices/commonSlice";

export const fetchCustomizeProducts = () => {
    return async (dispatch) => {
        try {
            dispatch(setCustomizeProductList([]));
            dispatch(setCustomizeProductLoading(true));
            const customizProductList =
                await productService.getCustomizeProduct();
            // await productService.getCustomizeProduct(
            //     CATEGORIES,
            //     RING
            // );
            if (customizProductList) {
                const tempUniqueFilterOptions = getUniqueFilterOptions(
                    customizProductList
                );

                dispatch(setUniqueFilterOptions(tempUniqueFilterOptions));
            }

            dispatch(setCustomizeProductList(customizProductList));
        } catch (e) {
            dispatch(setCustomizeProductList([]));
        } finally {
            dispatch(setCustomizeProductLoading(false));
        }
    };
};

export const fetchCustomizeProductsVariation = () => {
    return async (dispatch) => {
        try {
            dispatch(setCustomizeOptionLoading(true));
            const customizProductList =
                await productService.getCustomizeProduct();
            if (customizProductList) {
                const tempUniqueFilterOptions = getUniqueFilterOptions(
                    customizProductList
                );

                dispatch(setUniqueFilterOptionsForHeader(tempUniqueFilterOptions));
            }

        } catch (e) {
            console.log('e', e)
            dispatch(setUniqueFilterOptionsForHeader([]));
        } finally {
            dispatch(setCustomizeOptionLoading(false));
        }
    };
};