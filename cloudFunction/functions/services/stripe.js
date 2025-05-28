const dotenv = require("dotenv");
dotenv.config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const exportFunction = {};

exportFunction.refundAmount = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { paymentIntentId, amountInCents } = params;
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        // Specify the amount you want to refund, in cents (e.g., 1000 for $10.00)
        amount: amountInCents,
      });
      resolve(refund);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.cancelPaymentIntent = (paymentIntentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      resolve(paymentIntent);
    } catch (e) {
      reject(e);
    }
  });
};

exportFunction.retrivePaymentIntent = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { paymentIntentId, options } = params;

      const paymentIntentObjData = await stripe.paymentIntents.retrieve(
        paymentIntentId,
        options
      );
      resolve(paymentIntentObjData);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = exportFunction;
