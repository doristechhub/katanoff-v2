import paypal from "@/assets/images/payment/paypal.webp";
import stripe from "@/assets/images/payment/stripe.webp";
import mastercard from "@/assets/images/payment/mastercard.webp";
import visa from "@/assets/images/payment/visa.webp";
export const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
  { img: visa, name: "Visa", altAttr: "", titleAttr: "" },
  { img: mastercard, name: "Mastercard", altAttr: "", titleAttr: "" },
];
