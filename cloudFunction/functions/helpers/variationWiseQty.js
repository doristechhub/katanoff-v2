const { areArraysEqual } = require("./areArraysEqual");

const getVariComboPriceQty = (arrayOfCombinations, selectedVariations) => {
  const array1 = selectedVariations.map((item) => {
    return {
      variationId: item.variationId,
      variationTypeId: item.variationTypeId,
    };
  });

  const findedCombination = arrayOfCombinations.find((combinationsItem) => {
    const array2 = combinationsItem.combination;
    return areArraysEqual(array1, array2);
  });
  return findedCombination;
};

module.exports = { getVariComboPriceQty };
