// utils/filterUtils.js
import { fetchFilteredDiamondProducts } from "../store/actions/diamondProductActions";
import { fetchFilteredDiamonds } from "../store/actions/diamondActions";
import { setCurrentPage } from "../store/actions/commonActions";

const convertStringArrayToObjectArray = (stringArr) => {
  return stringArr?.map((x) => ({
    title: x?.replaceAll("_", " "),
    value: x,
  }));
};

// Helper function to get selected range values
const getSelectedRangeValues = (startIndex, endIndex, referenceArray) =>
  convertStringArrayToObjectArray(referenceArray.slice(startIndex, endIndex));

export const applyProductFilter = ({
  dispatch,
  values = {},
  diamondId,
  newSelectedItems = null,
}) => {
  const payload = {
    diamondId,
    selectedProductTypes: values?.selectedProductTypes,
    selectedCollections: values?.selectedCollections,
    selectedSettingStyles: newSelectedItems ?? values?.selectedSettingStyles, // Use newSelectedItems if provided
    selectedVariations: values?.selectedVariations,
    priceRangeValues: values?.priceRangeValues,
  };

  dispatch(setCurrentPage({ currentPage: 1 })); // Reset page to 1
  dispatch(fetchFilteredDiamondProducts(payload));
};

export const applyDiamondFilter = ({
  dispatch,
  values = {},
  productId,
  uniqueDiamondCuts = [],
  uniqueDiamondColors = [],
  uniqueDiamondClarity = [],
  uniqueFluorescenceRange = [],
  uniquePolishRange = [],
  uniqueSymmetryRange = [],
}) => {
  const payload = {
    productId,
    selectedDiaTypes: values?.selectedDiaTypes,
    selectedDiaShapes: values?.selectedDiaShapes,
    caratRangeValues: values?.caratRangeValues,
    diaPriceRangeValues: values?.diaPriceRangeValues,
    selectedDiaCutValues: getSelectedRangeValues(
      values?.selectedDiaCutValues?.[0],
      values?.selectedDiaCutValues?.[1],
      uniqueDiamondCuts
    ),
    selectedDiaColorValues: getSelectedRangeValues(
      values?.selectedDiaColorValues?.[0],
      values?.selectedDiaColorValues?.[1],
      uniqueDiamondColors
    ),
    selectedDiaClarityValues: getSelectedRangeValues(
      values?.selectedDiaClarityValues?.[0],
      values?.selectedDiaClarityValues?.[1],
      uniqueDiamondClarity
    ),
    lwRangeValues: values?.lwRangeValues,
    selectedDiaFluorescenceValues: getSelectedRangeValues(
      values?.selectedDiaFluorescenceValues?.[0],
      values?.selectedDiaFluorescenceValues?.[1],
      uniqueFluorescenceRange
    ),
    selectedDiaPolishValues: getSelectedRangeValues(
      values?.selectedDiaPolishValues?.[0],
      values?.selectedDiaPolishValues?.[1],
      uniquePolishRange
    ),
    selectedDiaSymmrtriesValues: getSelectedRangeValues(
      values?.selectedDiaSymmrtriesValues?.[0],
      values?.selectedDiaSymmrtriesValues?.[1],
      uniqueSymmetryRange
    ),
    tablePercRangeValues: values?.tablePercRangeValues,
    depthPercRangeValues: values?.depthPercRangeValues,
    selectedDiaCertificates: values?.selectedDiaCertificates,
  };

  dispatch(setCurrentPage({ currentPage: 1 })); // Reset page to 1
  dispatch(fetchFilteredDiamonds(payload)); // Fetch new filtered diamonds
};
