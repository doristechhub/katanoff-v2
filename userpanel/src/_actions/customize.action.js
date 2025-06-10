import { CATEGORIES, RING } from "@/_helper/constants";
import { productService } from "@/_services";
import {
  setCustomizeProductList,
  setCustomizeProductLoading,
  setUniqueFilterOptions,
} from "@/store/slices/productSlice";
import { getUniqueFilterOptions } from "./product.actions";
import {
  setCustomizeOptionLoading,
  setUniqueDiamondShapesAndCaratBounds,
} from "@/store/slices/commonSlice";

export const fetchCustomizeProducts = (params) => {
  return async (dispatch) => {
    try {
      dispatch(setCustomizeProductList([]));
      dispatch(setCustomizeProductLoading(true));
      const customizProductList = await productService.getCustomizeProduct(params);

      if (customizProductList) {
        const tempUniqueFilterOptions =
          getUniqueFilterOptions(customizProductList);

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

export const fetchUniqueShapesAndCaratBounds = () => {
  return async (dispatch) => {
    try {
      dispatch(setCustomizeOptionLoading(true));
      const diamondData =
        await productService.fetchUniqueShapesAndCaratBounds();
      if (diamondData) {
        dispatch(setUniqueDiamondShapesAndCaratBounds(diamondData));
      }
    } catch (e) {
      dispatch(
        setUniqueDiamondShapesAndCaratBounds({
          uniqueDiamondShapes: [],
          caratBounds: [],
        })
      );
    } finally {
      dispatch(setCustomizeOptionLoading(false));
    }
  };
};
