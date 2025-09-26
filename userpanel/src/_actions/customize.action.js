import { customizeService, productService } from "@/_services";
import {
  setCustomizeProductList,
  setCustomizeProductLoading,
  setFilterProductLoading,
  setUniqueFilterOptions,
} from "@/store/slices/productSlice";
import { getUniqueFilterOptions } from "./product.actions";
import {
  setCustomizeOptionLoading,
  setUniqueDiamondShapesAndCaratBounds,
} from "@/store/slices/commonSlice";
import {
  setCustomizeProductSettings,
  setCustomizeProductSettingsLoading,
} from "@/store/slices/selectDiamondSlice";

export const fetchCustomizeProducts = (params) => {
  return async (dispatch) => {
    try {
      dispatch(setCustomizeProductList([]));
      dispatch(setFilterProductLoading(true));
      dispatch(setCustomizeProductLoading(true));
      const customizProductList = await productService.getCustomizeProduct(
        params
      );
      if (Array.isArray(customizProductList) && customizProductList.length > 0) {
        if (customizProductList) {
          const tempUniqueFilterOptions =
            getUniqueFilterOptions({ productList: customizProductList });
          dispatch(setUniqueFilterOptions(tempUniqueFilterOptions));
        }

        dispatch(setCustomizeProductList(customizProductList));
      }
      else {
        dispatch(setCustomizeProductList([]));
        dispatch(setFilterProductLoading(false));
      }
    } catch (e) {
      dispatch(setCustomizeProductList([]));
      dispatch(setFilterProductLoading(false));
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

export const fetchCustomizeProductSettings = () => {
  return async (dispatch) => {
    try {
      dispatch(setCustomizeProductSettingsLoading(true));

      const settingsData =
        await customizeService?.fetchCustomizeProductSettings();

      if (settingsData) {
        dispatch(setCustomizeProductSettings(settingsData));
      } else {
        dispatch(setCustomizeProductSettings({}));
      }
    } catch (error) {
      console.error("Failed to fetch customized product settings:", error);
      dispatch(setCustomizeProductSettings({}));
    } finally {
      dispatch(setCustomizeProductSettingsLoading(false));
    }
  };
};
