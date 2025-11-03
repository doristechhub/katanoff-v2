const getCurrentDate = () => {
  return Date.now();
};

const getNonCustomizedProducts = (products) => {
  if (!Array.isArray(products)) {
    return [];
  }
  return products.filter((product) => !product?.diamondDetail);
};

const formatPhoneNumber = (phone) => {
  const digits = phone.replace(/\D/g, ""); // Remove non-digits
  const display = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
    6,
    10
  )}`;
  const link = `+1${digits}`;
  return { display, link };
};

const gcd = (a, b) => {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const getFraction = (num) => {
  const whole = Math.floor(num);
  const decimal = +(num - whole).toFixed(3);

  let bestNum = 0;
  let bestDen = 1;
  let bestDiff = 1.0;

  for (let den = 1; den <= 16; den++) {
    const numCandidate = Math.round(decimal * den);
    const frac = numCandidate / den;
    const diff = Math.abs(decimal - frac);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestNum = numCandidate;
      bestDen = den;
    }
  }

  let fraction = "";
  if (bestNum !== 0 && bestDiff < 0.05) {
    let g = gcd(bestNum, bestDen);
    bestNum /= g;
    bestDen /= g;
    fraction = `${bestNum}/${bestDen}`;
  }

  const wholeStr = whole > 0 ? whole.toString() : "";
  return `${wholeStr} ${fraction}`.trim();
};

const formatCarats = (num) => {
  if (num <= 0) return "0";

  const integerPart = Math.floor(num);
  const fractional = num - integerPart;

  let rounded;
  if (fractional < 0.05) {
    rounded = integerPart;
  } else {
    rounded = Math.round(num / 0.05) * 0.05;
  }

  let fixed = rounded.toFixed(2);
  fixed = fixed.replace(/0+$/, "");
  fixed = fixed.replace(/\.$/, "");

  return fixed;
};

const formatProductNameWithCarat = ({ caratWeight, productName }) => {
  const formattedCarat =
    caratWeight > 0 ? `${getFraction(caratWeight)} ctw ` : "";
  // const formattedCarat =
  // caratWeight > 0 ? `${formatCarats(caratWeight)} ctw ` : "";
  return `${formattedCarat}${
    productName ? productName : "Unknown Product"
  }`.trim();
};

const formatCurrency = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "$0.00";
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatCurrencyWithDollar = (amount) => {
  const num = Number(amount);
  if (isNaN(num)) return "$0.00";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const capitalizeCamelCase = (str) => {
  if (!str) return "";
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
};

const formatDate = (date) => {
  if (!date) return "Invalid Date";
  const d = new Date(date);
  if (isNaN(d)) return "Invalid Date";
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
};

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const convertImageToBase64 = async (imagePath) => {
  try {
    if (!imagePath) {
      console.warn("No image path provided");
      return "";
    }
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      const response = await fetch(imagePath, { redirect: "follow" });
      if (!response.ok) {
        console.warn(
          `Failed to fetch image from ${imagePath}: ${response.statusText}`
        );
        return "";
      }
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer).toString("base64");
    } else {
      const absolutePath = path.resolve(__dirname, imagePath);
      await fs.access(absolutePath);
      const buffer = await fs.readFile(absolutePath);
      return Buffer.from(buffer).toString("base64");
    }
  } catch (error) {
    console.warn(`Failed to convert image at ${imagePath}: ${error.message}`);
    return "";
  }
};

const displayVariationsLabel = (variations) => {
  if (!Array.isArray(variations)) return "";

  const desiredOrder = [GOLD_TYPES, GOLD_COLOR, DIAMOND_SHAPE];
  const variationMap = {};
  const remaining = [];

  variations.forEach((item) => {
    const { variationName, variationTypeName } = item;
    if (variationName === RING_SIZE || variationName === LENGTH) return;
    if (desiredOrder.includes(variationName)) {
      variationMap[variationName] = variationTypeName;
    } else if (variationTypeName) {
      remaining.push(variationTypeName);
    }
  });

  const orderedValues = desiredOrder
    .map((key) => variationMap[key])
    .filter(Boolean);
  return [...orderedValues, ...remaining].join(", ");
};

const displayDiamondDetailsLabel = (diamondDetail) => {
  if (
    !diamondDetail ||
    typeof diamondDetail !== "object" ||
    Object.keys(diamondDetail).length === 0
  ) {
    return "";
  }

  const fields = [
    diamondDetail.caratWeight
      ? `Carat Weight: ${diamondDetail?.caratWeight}`
      : "",
    diamondDetail?.clarity ? `Clarity: ${diamondDetail?.clarity}` : "",
    diamondDetail?.color ? `Color: ${diamondDetail?.color}` : "",
    diamondDetail?.shapeName ? `Shape: ${diamondDetail?.shapeName}` : "",
  ].filter(Boolean);

  const result =
    fields.length > 0
      ? `
        <span class="font-semibold text-sm">Diamond Details:</span>
        <div class="flex flex-wrap gap-x-4 gap-y-1">
          <div class="min-w-[100px]">${fields[0] || ""}</div>
          <div class="min-w-[100px]">${fields[1] || ""}</div>
          </div>
           <div class="flex flex-wrap gap-x-4 gap-y-1">
          <div class="min-w-[100px]">${fields[2] || ""}</div>
          <div class="min-w-[100px]">${fields[3] || ""}</div>
          </div>
        </div>
      `
      : "";

  return result;
};

const generateProductTable = (products, quantityKey = "cartQuantity") => {
  return `
    <div class="w-full">
      <table class="w-full bg-white rounded-md">
        <thead>
          <tr class="bg-[#202a4e] text-white text-sm">
            <th class="p-2 w-16 text-left">Image</th>
            <th class="p-2 w-64 text-left">Product</th>
            <th class="p-2 w-16 text-center">Qty</th>
            <th class="p-2 w-24 text-right">Unit Price ($)</th>
            <th class="p-2 w-24 text-right">Total ($)</th>
          </tr>
        </thead>
        <tbody class="text-black text-xs leading-4">
          ${products
            .map((x) => {
              const variations = displayVariationsLabel(x.variations);
              const nameLine = formatProductNameWithCarat({
                caratWeight: x?.diamondDetail
                  ? x?.diamondDetail?.caratWeight
                  : x?.totalCaratWeight,
                productName: x.productName,
              });
              const diamondDetail = displayDiamondDetailsLabel(x.diamondDetail);
              return `
                <tr class="border-b border-gray-300">
                  <td class="p-2 text-center">
                    ${
                      x.productImage
                        ? `<img src="${x.productImage}" class="w-16 h-full object-contain mx-auto" alt="" />`
                        : ""
                    }
                  </td>
                  <td class="p-2 pl-4">
                    <span class="font-semibold text-sm">${nameLine}</span>
                    ${variations ? `<br>${variations}` : ""}
                    ${x.ringSize ? `<br>Ring Size: ${x.ringSize}` : ""}
                    ${x?.productLength ? `<br>Length: ${x.productLength}` : ""}
                    ${diamondDetail ? `<br>${diamondDetail}` : ""}
                  </td>
                  <td class="p-2 text-center">${x[quantityKey]}</td>
                  <td class="p-2 text-right">${formatCurrency(
                    x.productPrice
                  )}</td>
                  <td class="p-2 text-right">${formatCurrency(
                    x.unitAmount
                  )}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
};

const processProducts = async (products) => {
  if (!Array.isArray(products)) {
    throw new Error("Products must be an array");
  }
  return Promise.all(
    products.map(async (x) => {
      const base64Image = x?.productImage
        ? await convertImageToBase64(x.productImage)
        : "";
      return {
        ...x,
        productImage: base64Image ? `data:image/png;base64,${base64Image}` : "",
      };
    })
  );
};

const addNamesToVariationsArray = (variations, customizations) =>
  variations.map((v) => {
    const variationName = customizations?.customizationType?.find(
      (x) => x?.id === v?.variationId
    )?.title;
    const variationTypeName = customizations?.customizationSubType?.find(
      (x) => x?.id === v?.variationTypeId
    )?.title;
    return {
      ...v,
      ...(variationName && { variationName }),
      ...(variationTypeName && { variationTypeName }),
    };
  });

const hasDuplicateVariations = (variations) => {
  const uniqueVariationKeys = new Set();

  return variations.some((variation) => {
    const variationKey = `${variation.variationId}-${variation.variationTypeId}`;
    if (uniqueVariationKeys.has(variationKey)) {
      return true;
    }
    uniqueVariationKeys.add(variationKey);
    return false;
  });
};

const isValidVariationsArray = ({
  product,
  selectedVariations,
  diamondDetail,
  customizations,
}) => {
  if (!product || !Array.isArray(selectedVariations)) return false;

  const productVariationIds = (product?.variations || []).map(
    (v) => v.variationId
  );
  const productVariationTypeIds = (product?.variations || []).flatMap(
    (v) => v.variationTypes?.map((t) => t.variationTypeId) || []
  );

  // Check if all selected variations exist in product
  const allVariationsExist = selectedVariations.every(
    (v) =>
      productVariationIds.includes(v.variationId) &&
      productVariationTypeIds.includes(v.variationTypeId)
  );

  if (!allVariationsExist) {
    return false;
  }

  // Check whether duplicate varitons exits in product
  if (hasDuplicateVariations(selectedVariations)) {
    return false;
  }

  const enrichedSelected = addNamesToVariationsArray(
    selectedVariations,
    customizations
  );

  if (diamondDetail) {
    const hasGoldColor = enrichedSelected.some(
      (v) => v.variationName === GOLD_COLOR
    );
    const hasGoldType = enrichedSelected.some(
      (v) => v.variationName === GOLD_TYPES
    );
    const hasRingOrLength = enrichedSelected.some((v) =>
      [RING_SIZE, LENGTH].includes(v.variationName)
    );
    return hasGoldColor && hasGoldType && hasRingOrLength;
  }

  const requiredVariationIds = new Set(productVariationIds);
  const selectedVariationIds = new Set(
    selectedVariations.map((v) => v.variationId)
  );

  if (
    requiredVariationIds.size !== selectedVariationIds.size ||
    ![...requiredVariationIds].every((id) => selectedVariationIds.has(id))
  ) {
    return false;
  }

  return selectedVariations.every((selVar) => {
    const variation = product.variations.find(
      (v) => v.variationId === selVar.variationId
    );
    return variation?.variationTypes?.some(
      (t) => t.variationTypeId === selVar.variationTypeId
    );
  });
};

const MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT = 5;
const NEW_YORK = "New York";
const NEW_YORK_CODE = "NY";

const DISCOUNT_TYPES = {
  ORDER_DISCOUNT: "Order Discount",
};

const DISCOUNT_DETAIL_TYPES = {
  PERCENTAGE: "Percentage",
  FIXED: "Fixed",
};

const DISCOUNT_PURCHASE_MODES = {
  ONE_TIME: "One-Time",
};

const DISCOUNT_CUSTOMER_ELIGIBILITY = {
  SELECTED_CUSTOMERS: "Selected Customers",
};

const DISCOUNT_APPLICATION_METHODS = {
  CODE: "Code",
  AUTOMATIC: "Automatic",
};

const SIGN_UP_DISCOUNT = "Sign Up Discount";

const CARD = "card";
// Constants for variation types
const GOLD_TYPES = "Gold Type";
const GOLD_COLOR = "Gold Color";
const DIAMOND_SHAPE = "Diamond Shape";
const RING_SIZE = "Ring Size";
const LENGTH = "Length";
const SALES_TAX_NOTE =
  "* Sales tax will be applied to addresses within New York State.";

module.exports = {
  getCurrentDate,
  formatPhoneNumber,
  getNonCustomizedProducts,
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  NEW_YORK,
  NEW_YORK_CODE,
  DISCOUNT_TYPES,
  DISCOUNT_DETAIL_TYPES,
  DISCOUNT_PURCHASE_MODES,
  DISCOUNT_CUSTOMER_ELIGIBILITY,
  DISCOUNT_APPLICATION_METHODS,
  SIGN_UP_DISCOUNT,
  CARD,
  GOLD_TYPES,
  LENGTH,
  GOLD_COLOR,
  DIAMOND_SHAPE,
  RING_SIZE,
  SALES_TAX_NOTE,
  formatProductNameWithCarat,
  formatCurrency,
  formatCurrencyWithDollar,
  capitalizeCamelCase,
  formatDate,
  convertImageToBase64,
  displayVariationsLabel,
  displayDiamondDetailsLabel,
  generateProductTable,
  processProducts,
  addNamesToVariationsArray,
  isValidVariationsArray,
};
