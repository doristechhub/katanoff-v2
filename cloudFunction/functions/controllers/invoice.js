const { RING_SIZE, LENGTH } = require("../helpers/common");
const sanitizeValue = require("../helpers/sanitizeParams");
const {
  orderService,
  returnService,
  productService,
  diamondShapeService,
} = require("../services");
const message = require("../utils/messages");
const { orderInovice } = require("../utils/orderInvoice");
const { returnInovice } = require("../utils/returnInvoice");

const enrichProducts = async ({
  products,
  productService,
  diamondShapeService,
  type,
}) => {
  const allCustomizations = await productService?.getAllCustomizations();
  const productIds = products
    .map((product) => product?.productId)
    .filter(Boolean);

  const productDetails = await productService?.getProductsByIds(
    productIds
  );
  const diamondShapeList = await diamondShapeService?.getAllDiamondShapes();
  return products.map((product) => {
    const productDetail =
      productDetails.find((p) => p?.id === product?.productId) || {};
    const variations = (product?.variations || [])?.map((v) => {
      const customizationType = allCustomizations?.customizationType?.find(
        (ct) => ct?.id === v?.variationId
      );
      const customizationSubType =
        allCustomizations?.customizationSubType?.find(
          (cst) => cst?.id === v?.variationTypeId
        );
      return {
        variationName: customizationType?.title || "Unknown",
        variationTypeName: customizationSubType?.title || "Unknown",
      };
    });

    let diamondDetail =
      product?.diamondDetail || productDetail?.diamondDetail || {};
    if (diamondDetail?.shapeId) {
      const shapeSubType = diamondShapeList?.find(
        (shape) => shape?.id === diamondDetail?.shapeId
      );
      diamondDetail = {
        ...diamondDetail,
        shapeName: shapeSubType?.title || "Unknown",
      };
    }

    return {
      ...product,
      productImage:
        productDetail?.yellowGoldThumbnailImage ||
        productDetail?.roseGoldThumbnailImage ||
        productDetail?.whiteGoldThumbnailImage ||
        "",
      productName: productDetail?.productName || "Unknown Product",
      totalCaratWeight: productDetail?.totalCaratWeight || 0,
      diamondDetail,
      variations,
      cartQuantity: product?.cartQuantity || 1,
      ...(type === "order"
        ? { cartQuantity: product.cartQuantity || 1 }
        : { returnQuantity: product.returnQuantity || 1 }),
    };
  });
};

const transformInvoiceData = (data, type) => {
  const baseData = {
    orderNumber: data?.orderNumber,
    createdDate: data?.createdDate,
    orderStatus: data?.orderStatus || "unknown",
    paymentStatus: data?.paymentStatus || "unknown",
    paymentMethodDetails: data?.paymentMethodDetails || {},
    billingAddress: data?.billingAddress || {},
    shippingAddress: data?.shippingAddress || {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      mobile: "",
    },
    products: data?.products?.map((item) => {
      const ringSizeVariation = (item?.variations || []).find(
        (v) => v.variationName === RING_SIZE
      );
      const lengthVariation = (item?.variations || []).find(
        (v) => v.variationName === LENGTH
      );
      return {
        productImage: item?.productImage || "",
        productName: item?.productName || "Unknown Product",
        totalCaratWeight: item?.totalCaratWeight || 0,
        variations: item?.variations || [],
        ...(ringSizeVariation
          ? { ringSize: ringSizeVariation.variationTypeName }
          : {}),
        ...(lengthVariation
          ? { productLength: lengthVariation.variationTypeName }
          : {}),
        diamondDetail: item?.diamondDetail || {},
        cartQuantity: item?.cartQuantity || 1,
        ...(type === "return"
          ? { returnQuantity: item?.returnQuantity || 1 }
          : {}),

        productPrice: item?.productPrice || 0,
        unitAmount: item?.unitAmount || 0,
      };
    }),
    subTotal: data?.subTotal || 0,
    discount: data?.discount || 0,
    salesTax: data?.salesTax || 0,
    salesTaxPercentage: data?.salesTaxPercentage || 0,
    shippingCharge: data?.shippingCharge || 0,
    total: data?.total || 0,
  };

  if (type === "return") {
    return {
      ...baseData,
      status: data?.status || "unknown",
      paymentStatus: data?.returnPaymentStatus || "unknown",
      returnRequestAmount: data?.returnRequestAmount || 0,
      refundAmount: data?.refundAmount || 0,
      serviceFees: data?.serviceFees || 0,
    };
  }

  return baseData;
};

const invoiceController = async (req, res, type = "order") => {
  try {
    const idKey = type === "order" ? "orderNumber" : "returnId";
    let id = req.body[idKey];
    id = sanitizeValue(id) ? id?.trim() : "";

    if (!id) {
      return res.json({
        status: 400,
        message: message.custom(`Invalid ${idKey}`),
      });
    }

    // Fetch data
    const findPattern =
      type === "order" ? { orderNumber: id } : { returnId: id };
    const service = type === "order" ? orderService : returnService;
    let data;
    if (type === "order") {
      data = await service?.findByOrderNumber(findPattern);
    } else {
      data = await service?.findOne(findPattern);
    }

    if (!data) {
      return res.json({
        status: 404,
        message: message.custom(
          `${type === "order" ? "Order" : "Return"} not found`
        ),
      });
    }

    // For returns, fetch order data for addresses
    let enrichedData = data;
    if (type === "return") {
      const orderData = await orderService?.findByOrderNumber({
        orderNumber: data?.orderNumber,
      });
      if (!orderData) {
        return res.json({
          status: 404,
          message: message.custom("Order not found for return"),
        });
      }
      enrichedData = {
        ...data,
        billingAddress: orderData?.billingAddress || {},
        shippingAddress: orderData?.shippingAddress || {},
      };
    }

    // Enrich products
    enrichedData.products = await enrichProducts({
      products: enrichedData?.products,
      productService,
      diamondShapeService,
      type,
    });

    // Transform to invoice data
    const invoiceData = transformInvoiceData(enrichedData, type);

    // Generate PDF
    const pdfBuffer =
      type === "order"
        ? await orderInovice(invoiceData)
        : await returnInovice(invoiceData);

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${type === "order" ? "invoice" : "return-invoice"
      }.pdf`
    );
    res.status(200).end(pdfBuffer);
  } catch (error) {
    console.error(`Error in invoiceController (${type}):`, error);
    return res.json({
      status: 500,
      message: message.custom(`Server error: ${error.message}`),
    });
  }
};

module.exports = {
  invoiceController,
  enrichProducts,
  transformInvoiceData,
};
