const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const axios = require("axios");

/**
  This API is used for validation address.
*/
const validateAddress = async (req, res) => {
  try {
    let { regionCode, addressLine } = req.body;
    regionCode = sanitizeValue(regionCode) ? regionCode.trim() : null;
    addressLine = sanitizeValue(addressLine) ? addressLine.trim() : null;

    if (regionCode && addressLine) {
      const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.GOOGLE_API_KEY}`;
      const bodyPayload = {
        address: {
          regionCode: regionCode,
          addressLines: [addressLine],
          // locality: "Mountain View",
        },
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(url, bodyPayload, config);
      const error = response?.data?.error;
      if (error) {
        return res.json({
          status: error?.code,
          message: message.custom(error.status),
        });
      }
      const responseAddress = response?.data?.result?.address;
      const addressComponents = responseAddress?.addressComponents;

      const unconfirmedComponentTypes =
        responseAddress?.unconfirmedComponentTypes; // array
      const missingComponentTypes = responseAddress?.missingComponentTypes; // array

      const unconfirmedAddress = addressComponents.filter(
        (obj) => !obj.confirmationLevel || obj.confirmationLevel !== "CONFIRMED"
      );

      if (unconfirmedComponentTypes || missingComponentTypes) {
        return res.json({
          status: 422,
          unconfirmedComponentTypes,
          missingComponentTypes,
          unconfirmedAddress,
          message: message.custom("Your address has not been validated"),
        });
      }

      const responseVerdictData = response?.data?.result?.verdict;
      const responseUspsData = response?.data?.result?.uspsData;
      if (responseUspsData) {
        const dpvConfirmation = responseUspsData?.dpvConfirmation;
        const standardizedAddress = responseUspsData?.standardizedAddress;

        let responseMessage = "";
        if (["Y", "S"].includes(dpvConfirmation)) {
          // if(dpvConfirmation === "Y") responseMessage = "Confirmed"
          // if(dpvConfirmation === "S") responseMessage = "Apartment or suite numbers not confirmed."

          return res.json({
            status: 200,
            standardizedAddress,
            addressComponents: addressComponents,
            message: message.SUCCESS,
          });
        } else if (dpvConfirmation === "D") {
          responseMessage = "Apartment or suite numbers missing.";
        } else if (dpvConfirmation === "N") {
          responseMessage =
            "House or building number and apartment or suite numbers not confirmed.";
        } else {
          responseMessage = "Invalid Address";
        }
        return res.json({
          status: 422,
          message: message.custom(responseMessage),
        });
      } else {
        return res.json({
          status: 400,
          message: message.custom("Invalid Address!"),
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

module.exports = {
  validateAddress,
};
