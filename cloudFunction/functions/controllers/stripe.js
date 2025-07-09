const {
  orderService,
  productService,
  cartService,
  stripeService,
  returnService,
  discountService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const orderNum = require("../helpers/orderNum");
const message = require("../utils/messages");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const {
  getSellingPrice,
  calculateSubTotal,
  calculateCustomizedProductPrice,
  calculateOrderDiscount,
} = require("../helpers/calculateAmount");
const { areArraysEqual } = require("../helpers/areArraysEqual");
const { updateProductQty } = require("../services/product");
const dotenv = require("dotenv");
const { getMailTemplateForRefundStatus } = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const { getVariComboPriceQty } = require("../helpers/variationWiseQty");
const {
  MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT,
  getNonCustomizedProducts,
  DISCOUNT_TYPES,
  NEW_YORK,
} = require("../helpers/common");
dotenv.config();

/**
  This API is used for create payment intent.
*/
const createPaymentIntent = async (req, res) => {
  try {
    const userData = req?.userData;

    const activeProductsList = await productService.getAllActiveProducts();
    if (userData) {
      const findPattern = {
        key: "userId",
        value: userData?.id,
      };
      const userWiseCartData = await cartService.find(findPattern);
      req.body.userId = userData?.id;
      req.body.cartList = userWiseCartData;
    }

    const { createdOrder } = await createOrder({
      payload: req.body,
      activeProductsList,
      res,
      userData,
    });
    if (createdOrder) {
      const {
        id: orderId,
        shippingAddress,
        total,
        products,
        orderNumber,
        paymentMethod,
      } = createdOrder;
      console.log(createdOrder, "createdOrder");
      stripe.customers
        .create({
          name: shippingAddress.name,
          email: shippingAddress.email,
          address: {
            line1: shippingAddress.address,
            postal_code: shippingAddress.pinCode,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
          },
          metadata: {
            orderId: orderId,
          },
        })
        .then((customer) => {
          stripe.paymentIntents
            .create({
              amount: Math.round(total * 100), // in cents
              currency: process.env.STRIPE_ACCEPT_CURRENCY,
              // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
              automatic_payment_methods: {
                enabled: true,
              },
              shipping: {
                name: shippingAddress.name,
                address: {
                  line1: shippingAddress.address,
                  postal_code: shippingAddress.pinCode,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  country: shippingAddress.country,
                },
              },
              customer: customer.id,
              description: `Payment for Order Number ${orderNumber}`,
            })
            .then(async (paymentIntent) => {
              // After success, update order with paymentIntentId and customerId
              const findPattern = {
                orderId: orderId,
              };
              const updatePattern = {
                stripeCustomerId: customer.id,
                stripePaymentIntentId: paymentIntent.id,
              };

              await orderService.findOneAndUpdate(findPattern, updatePattern);
              return res.json({
                status: 200,
                orderId: orderId,
                paymentMethod,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
              });
            })
            .catch(async (e) => {
              // Remove order from database
              const findPattern = {
                orderId: orderId,
              };
              await orderService.deleteOne(findPattern);

              // update product qty for non-customized products
              const nonCustomizedProducts = getNonCustomizedProducts(products);
              await updateProductQty(nonCustomizedProducts);
              // remove customer from stripe
              const deleted = await stripe.customers.del(customer.id);
              return res.json({
                status: 500,
                message: message.SERVER_ERROR,
              });
            });
        })
        .catch(async (e) => {
          // remove order from database
          const findPattern = {
            orderId: orderId,
          };
          await orderService.deleteOne(findPattern);
          // update product qty for non-customized products
          const nonCustomizedProducts = getNonCustomizedProducts(products);
          await updateProductQty(nonCustomizedProducts);

          return res.json({
            status: 500,
            message: message.SERVER_ERROR,
          });
        });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for check payment intent status.
*/
const checkPaymentIntentStatus = async (req, res) => {
  try {
    let { paymentIntentId } = req.body;
    paymentIntentId = sanitizeValue(paymentIntentId)
      ? paymentIntentId.trim()
      : "";
    if (paymentIntentId) {
      const pIFindPattern = {
        paymentIntentId: paymentIntentId,
        options: {
          expand: ["latest_charge.balance_transaction"],
        },
      };
      const paymentIntent = await stripeService.retrivePaymentIntent(
        pIFindPattern
      );
      if (paymentIntent && paymentIntent.status === "requires_payment_method") {
        return res.json({
          status: 200,
          paymentIntentStatus: paymentIntent.status,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.custom("Invalid payment intent"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for cancel payment intent.
*/
const cancelPaymentIntent = async (req, res) => {
  try {
    let { paymentIntentId, orderId } = req.body;
    paymentIntentId = sanitizeValue(paymentIntentId)
      ? paymentIntentId.trim()
      : null;
    if (paymentIntentId && orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        const paymentIntent = await stripe.paymentIntents.cancel(
          paymentIntentId
        );
        // remove order from database
        await orderService.deleteOne(findPattern);

        //  update product qty for non-customized products
        const nonCustomizedProducts = getNonCustomizedProducts(
          orderData.products
        );
        await updateProductQty(nonCustomizedProducts);

        return res.json({
          status: 200,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

const createOrder = async ({ payload, activeProductsList, res, userData }) => {
  try {
    let {
      cartList,
      userId,
      countryName,
      firstName,
      lastName,
      address,
      city,
      state,
      stateCode,
      pinCode,
      mobile,
      email,
      companyName,
      apartment,
      shippingCharge,
      paymentMethod = "stripe",
      promoCode,
    } = payload || {};

    // Sanitize inputs
    cartList = Array.isArray(cartList) ? cartList : [];
    countryName = sanitizeValue(countryName) ? countryName.trim() : null;
    firstName = sanitizeValue(firstName) ? firstName.trim() : null;
    lastName = sanitizeValue(lastName) ? lastName.trim() : null;
    address = sanitizeValue(address) ? address.trim() : null;
    city = sanitizeValue(city) ? city.trim() : null;
    state = sanitizeValue(state) ? state.trim() : null;
    stateCode = sanitizeValue(stateCode) ? stateCode.trim() : null;
    pinCode = pinCode ? pinCode?.toString()?.trim() : null;
    mobile = mobile ? Number(mobile) : null;
    email = sanitizeValue(email) ? email.trim() : null;
    paymentMethod = sanitizeValue(paymentMethod) ? paymentMethod.trim() : null;

    userId = sanitizeValue(userId) ? userId.trim() : "";
    promoCode = sanitizeValue(promoCode) ? promoCode.trim() : "";
    companyName = sanitizeValue(companyName) ? companyName.trim() : "";
    apartment = sanitizeValue(apartment) ? apartment.trim() : "";
    shippingCharge = shippingCharge ? +Number(shippingCharge).toFixed(2) : 0;

    // Validate required fields
    if (
      !cartList?.length ||
      !firstName ||
      !lastName ||
      !address ||
      !stateCode ||
      !countryName ||
      !city ||
      !state ||
      !pinCode ||
      !mobile ||
      !email ||
      !paymentMethod
    ) {
      return res.json({
        status: 400,
        message: !cartList?.length
          ? message.custom("Cart data not found")
          : message.INVALID_DATA,
      });
    }

    // Process cart items
    const allCustomizations = await productService.getAllCustomizations();

    const availableCartItems = [];

    for (const cartItem of cartList) {
      const { productId, quantity, variations, diamondDetail } = cartItem;
      if (
        !productId ||
        !Array.isArray(variations) ||
        !variations.length ||
        !quantity
      ) {
        continue; // Skip invalid cart items
      }

      const product = activeProductsList.find((p) => p.id === productId);

      if (!product) {
        continue; // Skip if product not found
      }

      let adjustedQuantity = Number(quantity);
      let productPrice = 0;
      let isCustomized = !!diamondDetail;

      // Validate variations (ensure they exist in product.variations)
      const isValidVariations = product?.variComboWithQuantity?.some((combo) =>
        combo.combination.every((item) =>
          variations?.some(
            (selected) =>
              selected?.variationId === item?.variationId &&
              selected?.variationTypeId === item?.variationTypeId
          )
        )
      );

      if (!isValidVariations) {
        continue; // Skip if variations are invalid
      }

      // Map variations to include variationTypeName and variationName
      const enrichedVariations = variations.map((variation) => {
        const type = allCustomizations.customizationType.find(
          (t) => t.id === variation.variationId
        );
        const subType = allCustomizations.customizationSubType.find(
          (s) => s.id === variation.variationTypeId
        );
        return {
          variationId: variation.variationId,
          variationName: type?.title || "Unknown Variation",
          variationTypeId: variation.variationTypeId,
          variationTypeName: subType?.title || "Unknown Type",
        };
      });

      if (isCustomized) {
        // Handle customized product with diamondDetail

        if (!product.isDiamondFilter) {
          continue; // Skip if product does not support diamond customization
        }

        const { shapeId, caratWeight, clarity, color } = diamondDetail || {};
        if (!shapeId || !caratWeight || !clarity || !color) {
          continue; // Skip if diamondDetail is incomplete
        }

        // Validate diamond filters
        const { diamondShapeIds, caratWeightRange } = product.diamondFilters;

        if (
          !diamondShapeIds.includes(shapeId) ||
          caratWeight < caratWeightRange.min ||
          caratWeight > caratWeightRange.max
        ) {
          continue; // Skip if diamond details are invalid
        }

        // Validate quantity for customized product
        if (
          adjustedQuantity <= 0 ||
          adjustedQuantity > MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT
        ) {
          adjustedQuantity = Math.min(
            quantity,
            MAX_ALLOW_QTY_FOR_CUSTOM_PRODUCT
          );
        }

        // Calculate price for customized product
        try {
          const customProductDetail = {
            netWeight: product?.netWeight,
            sideDiamondWeight: product?.sideDiamondWeight,
          };
          const centerDiamondDetail = { caratWeight, clarity, color };
          productPrice = calculateCustomizedProductPrice({
            centerDiamondDetail,
            productDetail: customProductDetail,
          });
        } catch (e) {
          continue; // Skip if price calculation fails
        }
      } else {
        // Handle non-customized product
        const variCombo = getVariComboPriceQty(
          product.variComboWithQuantity,
          variations
        );
        if (
          !variCombo ||
          isNaN(variCombo.quantity) ||
          variCombo.quantity <= 0
        ) {
          continue; // Skip if variation combo is invalid or out of stock
        }

        // Validate and adjust quantity
        if (adjustedQuantity <= 0 || adjustedQuantity > variCombo.quantity) {
          adjustedQuantity = Math.min(quantity, variCombo.quantity);
        }
        productPrice = variCombo.price || 0;
      }

      // Calculate selling price with product discount
      const sellingPrice = getSellingPrice({
        price: productPrice,
        discount: product?.discount || 0,
        isCustomized,
      });

      availableCartItems.push({
        ...cartItem,
        diamondDetail: isCustomized ? diamondDetail : undefined,
        quantity: adjustedQuantity,
        quantityWiseSellingPrice: sellingPrice * adjustedQuantity,
        productPrice: sellingPrice, // Price per unit
      });
    }

    // Check if valid cart items exist
    if (!availableCartItems.length) {
      return res.json({
        status: 409,
        message: "No valid items in cart or insufficient quantity available",
      });
    }

    // Create shipping address
    const shippingAddress = {
      country: countryName,
      name: `${firstName} ${lastName}`,
      companyName,
      address,
      apartment,
      city,
      state,
      stateCode,
      pinCode,
      mobile,
      email,
    };

    const tempArr = availableCartItems.map((x) => ({
      quantityWiseSellingPrice: x?.quantityWiseSellingPrice,
    }));
    const subTotal = calculateSubTotal(tempArr);

    let matchedDiscount = null;

    // Validate promo code if provided and get purchaseMode
    if (promoCode) {
      const promoValidation = await discountService.validatePromoCode({
        promoCode,
        subTotal,
        orderService,
        userData,
      });
      if (!promoValidation?.valid) {
        return res.json({
          status: 400,
          message: promoValidation?.message,
        });
      }
      matchedDiscount = promoValidation?.foundDiscount;
    }

    // Apply order-level discount
    let orderDiscount = 0;
    if (
      matchedDiscount &&
      matchedDiscount?.discountType === DISCOUNT_TYPES?.ORDER_DISCOUNT
    ) {
      orderDiscount = calculateOrderDiscount({ matchedDiscount, subTotal });
    }

    // Recalculate totals
    const finalSubTotal = subTotal - orderDiscount;
    const isNewYorkState = state.toLowerCase() === NEW_YORK.toLowerCase();
    const salesTaxPerc = isNewYorkState ? 8 : 0;
    const salesTax = +(finalSubTotal * (salesTaxPerc / 100)).toFixed(2);
    const total = +(finalSubTotal + shippingCharge + salesTax).toFixed(2);

    const orderItem = {
      orderNumber: await orderNum.generateOrderId(),
      userId: userId,
      products: availableCartItems.map((item) => ({
        productId: item.productId,
        variations: item.variations.map((variItem) => ({
          variationId: variItem.variationId,
          variationTypeId: variItem.variationTypeId,
        })),
        productPrice: item.productPrice,
        unitAmount: item.quantityWiseSellingPrice,
        cartQuantity: item.quantity,
        diamondDetail: item.diamondDetail || null,
      })),
      shippingAddress,
      subTotal,
      paymentMethod,
      discount: orderDiscount,
      salesTax,
      salesTaxPercentage: salesTaxPerc,
      shippingCharge,
      total,
      stripeCustomerId: "",
      stripePaymentIntentId: "",
      orderStatus: "pending",
      paymentStatus: "pending",
      cancelReason: "",
      promoCode: matchedDiscount?.promoCode || "",
    };

    // Save order
    const createdOrder = await orderService.create(orderItem);

    // Update product quantities
    for (let i = 0; i < availableCartItems.length; i++) {
      const cartItem = availableCartItems[i];
      const findedProduct = activeProductsList.find(
        (product) => product.id === cartItem.productId
      );
      if (!cartItem?.diamondDetail && findedProduct) {
        // Only update quantities for non-customized products
        const tempCombiArray = [...findedProduct.variComboWithQuantity];

        const index = tempCombiArray.findIndex((combination) =>
          areArraysEqual(combination.combination, cartItem.variations)
        );

        if (index !== -1) {
          tempCombiArray[index].quantity -= cartItem.quantity;
        }

        // Update product in database
        const findPattern = { productId: findedProduct.id };
        const updatePattern = { variComboWithQuantity: tempCombiArray };
        await productService.findOneAndUpdate(findPattern, updatePattern);
      }

      if (availableCartItems.length === i + 1) {
        return { createdOrder };
      }
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

// Stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// let endpointSecret;

const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

const stripeWebhook = async (req, res) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret,
  });

  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  // Handle the event
  if (
    eventType === "charge.refund.updated" &&
    data?.status &&
    data?.payment_intent
  ) {
    let orderUpdatePatternWithRefund = {
      stripeRefundId: data.id,
      updatedDate: Date.now(),
    };

    let returnUpdatePatternWithRefund = {
      stripeRefundId: data.id,
      updatedDate: Date.now(),
    };

    switch (data.status) {
      case "succeeded":
        orderUpdatePatternWithRefund.paymentStatus = "refunded";
        returnUpdatePatternWithRefund.returnPaymentStatus = "refunded";
        break;
      case "failed":
        orderUpdatePatternWithRefund.paymentStatus = "failed_refund";
        orderUpdatePatternWithRefund.stripeRefundFailureReason =
          data.failure_reason;

        returnUpdatePatternWithRefund.returnPaymentStatus = "failed_refund";
        returnUpdatePatternWithRefund.stripeRefundFailureReason =
          data.failure_reason;
        break;
      case "canceled":
        orderUpdatePatternWithRefund.paymentStatus = "cancelled_refund";
        returnUpdatePatternWithRefund.returnPaymentStatus = "cancelled_refund";
        break;
    }
    const findPattern = {
      paymentIntentId: data.payment_intent,
    };
    const orderData = await orderService.findByPaymentIntentId(findPattern);
    if (orderData?.id) {
      const destinationDetail = data?.destination_details?.card;
      if (
        destinationDetail?.reference_status === "available" &&
        destinationDetail?.reference_type === "acquirer_reference_number"
      ) {
        orderUpdatePatternWithRefund.stripeARNNumber =
          destinationDetail?.reference;
        returnUpdatePatternWithRefund.stripeARNNumber =
          destinationDetail?.reference;
      }
      if (orderData?.returnRequestIds?.length) {
        const findPattern = {
          key: "orderId",
          value: orderData.id,
        };
        const orderWiseReturnsData = await returnService.find(findPattern);
        const returnData = [...orderWiseReturnsData]
          .filter((item) => item.status === "received")
          .sort((a, b) => b.updatedDate - a.updatedDate);
        if (returnData?.length) {
          const returnFindPattern = {
            returnId: returnData[0]?.id,
          };
          returnService.findOneAndUpdate(
            returnFindPattern,
            returnUpdatePatternWithRefund
          );
        }
      } else {
        const orderFindPattern = {
          orderId: orderData.id,
        };
        orderService.findOneAndUpdate(
          orderFindPattern,
          orderUpdatePatternWithRefund
        );
      }
      // send mail for refund status
      if (["succeeded", "failed", "canceled"].includes(data.status)) {
        sendRefundStatusEmail(data.status, orderData);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};

/**
 * Sends an email to notify the customer about the refund status based on the event status.
 * @param {string} eventStatus - The status of the refund event (e.g., 'pending_refund', 'succeeded', 'refunded', 'failed', etc.).
 * @param {Object} orderData - The order data containing customer and order details.
 * @param {Object} orderData.shippingAddress - The customer's shipping address details.
 * @param {string} orderData.shippingAddress.name - The customer's name.
 * @param {string} orderData.shippingAddress.email - The customer's email address.
 * @param {string} orderData.orderNumber - The order number associated with the refund.
 * @returns {void}
 */
const sendRefundStatusEmail = (eventStatus, orderData) => {
  let statusKey;

  switch (eventStatus) {
    case "pending_refund":
      statusKey = "pending_refund";
      break;
    case "succeeded":
    case "refunded": // Both succeeded and refunded statuses map to 'refunded' template
      statusKey = "refunded";
      break;
    case "refund_initialization_failed":
      statusKey = "refund_initialization_failed";
      break;
    case "failed":
      statusKey = "failed_refund";
      break;
    case "canceled":
      statusKey = "cancelled_refund";
      break;
    default:
      return;
  }

  const { subject, description } = getMailTemplateForRefundStatus(
    orderData.shippingAddress.name,
    orderData.orderNumber,
    statusKey
  );

  sendMail(orderData.shippingAddress.email, subject, description);
};

module.exports = {
  createPaymentIntent,
  checkPaymentIntentStatus,
  cancelPaymentIntent,
  createOrder,
  stripeWebhook,
};
