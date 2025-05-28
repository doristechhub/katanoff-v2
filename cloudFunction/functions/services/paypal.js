const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const paypalBaseApiUrl = process.env.PAYPAL_API_URL;
const paypalClientId = process.env.PAYPAL_CLIENT_ID;
const paypalAppSecret = process.env.PAYPAL_APP_SECRET;
const exportFunction = {};

// Utility function to get PayPal access token
const getPaypalAccessToken = async () => {
  try {
    const authResponse = await axios.post(
      `${paypalBaseApiUrl}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${paypalClientId}:${paypalAppSecret}`
          ).toString("base64")}`,
        },
      }
    );
    return authResponse?.data?.access_token;
  } catch (error) {
    throw new Error("Failed to get PayPal access token");
  }
};

exportFunction.getAccessToken = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const access_token = await getPaypalAccessToken();
      resolve({ access_token });
    } catch (error) {
      reject(error);
    }
  });
};

exportFunction.createOrder = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { orderData } = params;
      if (!orderData?.orderNumber) {
        throw new Error("Order number not found");
      }

      const { orderNumber, total, shippingAddress } = orderData;
      const access_token = await getPaypalAccessToken();
      const bodyData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderNumber,
            description: `Payment for Order Number ${orderNumber}`,
            shipping: {
              name: {
                full_name: shippingAddress?.name || "",
              },
              email_address: shippingAddress?.email || "",
              address: {
                address_line_1: shippingAddress?.address || "",
                address_line_2: shippingAddress?.apartment || "",
                admin_area_1: shippingAddress?.state || "",
                admin_area_2: shippingAddress?.city || "",
                postal_code: shippingAddress?.pinCode || "",
                country_code: shippingAddress?.country || "",
              },
            },
            amount: {
              currency_code: "USD",
              value: total?.toString(),
            },
          },
        ],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };

      const paypalOrderResponse = await axios.post(
        `${paypalBaseApiUrl}/v2/checkout/orders`,
        bodyData,
        { headers }
      );

      resolve(paypalOrderResponse?.data);
    } catch (error) {
      reject(error);
    }
  });
};

exportFunction.captureOrder = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { paypalOrderId } = params;
      if (!paypalOrderId) {
        throw new Error("Missing paypalOrderId parameter");
      }

      const access_token = await getPaypalAccessToken();
      const paypalOrderCaptureResponse = await axios.post(
        `${paypalBaseApiUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      resolve(paypalOrderCaptureResponse?.data);
    } catch (error) {
      reject(error);
    }
  });
};

exportFunction.refundPayment = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { captureId, amount, currency = "USD", reason } = params;
      const access_token = await getPaypalAccessToken();
      const refundData = {
        amount: {
          value: amount.toString(),
          currency_code: currency,
        },
        note_to_payer: reason || "Order cancellation refund",
      };

      const refundResponse = await axios.post(
        `${paypalBaseApiUrl}/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      resolve(refundResponse?.data);
    } catch (error) {
      reject(error);
    }
  });
};

exportFunction.getCaptureDetails = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { captureId } = params;
      if (!captureId) {
        throw new Error("Missing captureId parameter");
      }

      const access_token = await getPaypalAccessToken();
      const captureResponse = await axios.get(
        `${paypalBaseApiUrl}/v2/payments/captures/${captureId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      resolve(captureResponse?.data);
    } catch (error) {
      reject(new Error(`Failed to fetch capture details: ${error.message}`));
    }
  });
};

module.exports = exportFunction;
