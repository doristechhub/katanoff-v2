const { formatPhoneNumber } = require("../helpers/common");
const {
  WEBSITE_URL,
  INSTAGRAM,
  INSTAGRAM_URL,
  FACEBOOK,
  FACEBOOK_URL,
  COMPANY_EMAIL,
  LOGO,
  COMPANY_MOBILE_NO,
  COMPANY_NAME,
} = require("./companyInfo");
const moment = require("moment");

const { display, link } = formatPhoneNumber(COMPANY_MOBILE_NO);
const headerTemplate = () => `
  <div style="padding: 1vw; border-bottom: 1px solid #e2e2e2; text-align: center;">
    <a href=${WEBSITE_URL}><img src=${LOGO} alt="Logo" style="width: 15vw; max-width: 170px; height: auto;"></a>
  </div>
`;

const footerTemplate = () => `
  <div style="text-align: center; border-top: 1px solid #e2e2e2; padding: 1vw 0;">
    <p style="font-family: 'Roboto', sans-serif; color: #2b2b2b; font-size: clamp(14px, 2vw, 18px); margin: 0.5vw 0;">Follow Us</p>
    <div style="margin: 0.3vw 0;">
      <a href=${FACEBOOK_URL} style="margin: 0 0.5vw; display: inline-block;">
        <img src=${FACEBOOK} alt="Facebook" style="width: clamp(18px, 2vw, 24px); height: clamp(18px, 2vw, 24px);" />
      </a>
      <a href=${INSTAGRAM_URL} style="margin: 0 0.5vw; display: inline-block;">
        <img src=${INSTAGRAM} alt="Instagram" style="width: clamp(18px, 2vw, 24px); height: clamp(18px, 2vw, 24px);" />
      </a>
    </div>
    <div style="text-align: center; color: #a5a5a5; font-size: clamp(12px, 2vw, 16px);">
  <p style="margin: 0; font-family: 'Roboto', sans-serif; font-weight: 400;">
    © 2025 ${COMPANY_NAME}. All rights reserved.
  </p>
  <p style="margin: 0.5vw 0;">
    Need help? <a href="mailto:${COMPANY_EMAIL}" style="font-family: 'Roboto', sans-serif; font-weight: 400; color: #a5a5a5; text-decoration: none;">
      Contact us at ${COMPANY_EMAIL}
    </a>
  </p>
</div>

  </div>
`;

const html = (body) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
      @media only screen and (max-width: 600px) {
        .container { padding: 5vw 3vw !important; }
        .mainTitle h2 { font-size: clamp(18px, 5vw, 22px) !important; }
        .subTitle h3 { font-size: clamp(16px, 4vw, 18px) !important; }
        .subTitle h6 { font-size: clamp(14px, 3.5vw, 16px) !important; }
        .text { font-size: clamp(14px, 3.5vw, 16px) !important; }
      }
    </style>
  </head>
  <body style="background-color: #f3f2ed; padding: clamp(50px, 10vw, 100px) 2vw; font-family: 'Roboto', sans-serif;">
    <div class="container" style="max-width: 750px; margin: auto; background-color: white; box-shadow: 0 5px 5px rgba(0, 0, 0, 0.21); border-radius: 10px;">
      ${headerTemplate()}
      <div style="padding: 0 2.4vw;">
        ${body}
      </div>
      ${footerTemplate()}
    </div>
  </body>
  </html>
`;

const welcomeTemplate = (fullName) => `
  <div style="padding: 3vw 2vw; color: #2b2b2b; font-family: 'Roboto', sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
      <tr>
        <td style="padding: 2vw 0; text-align: center;">
          <img src=${LOGO} alt="logo" style="width: 15vw; max-width: 150px; height: auto;">
        </td>
      </tr>
      <tr>
        <td style="padding: 2vw 0; text-align: center;" class="mainTitle">
          <h2 style="color: #000; font-family: 'Roboto', sans-serif; font-size: clamp(20px, 4vw, 28px); font-weight: 500; line-height: 1.5; margin: 0;">
            Welcome, ${fullName}
          </h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 2vw 3vw;" class="subTitle">
          <h3 style="color: #000; font-family: 'Roboto', sans-serif; font-size: clamp(16px, 3vw, 20px); font-weight: 500; line-height: 1.5; text-align: center; margin: 0;">
            Thanks for registering at ${COMPANY_NAME}
          </h3>
          <h6 style="color: #000; font-family: 'Roboto', sans-serif; font-size: clamp(14px, 2vw, 18px); font-weight: 400; line-height: 1.5; text-align: center; margin: 0.5vw 0;">
            We are thrilled to have you join our community of jewelry enthusiasts and fashion connoisseurs.<br>
            At ${COMPANY_NAME}, we believe every piece of jewelry tells a unique story, and we're here to help you find the perfect pieces that resonate with your style and personality.
          </h6>
          <table style="font-family: 'Roboto', sans-serif; font-size: clamp(14px, 2vw, 18px); font-weight: 400; line-height: 1.5; text-align: justify; margin: 0.5vw 0;">
            <tr><td>Here's what you can look forward to:</td></tr>
            <tr><td>✨ Explore our curated collection of exquisite jewelry, handpicked for you.</td></tr>
            <tr><td>✨ Stay updated on the latest trends, exclusive offers, and access to limited editions.</td></tr>
            <tr><td>✨ Personalized recommendations tailored to your unique taste.</td></tr>
            <tr><td>✨ Hassle-free shopping experience with secure transactions and speedy delivery.</td></tr>
          </table>
          <p style="text-align: center; padding: 1.5vw 0; font-size: clamp(14px, 2vw, 18px);">
            Feel free to reach out to our dedicated customer support team if you have any questions or need assistance.
            We're here to make your jewelry journey unforgettable!
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 2vw 0; text-align: center;">
          <p style="color: #bbb; font-family: 'Roboto', sans-serif; font-size: clamp(12px, 2vw, 14px); margin: 0.5vw 0;">Happy Shopping,</p>
          <p style="color: #bbb; font-family: 'Roboto', sans-serif; font-size: clamp(12px, 2vw, 14px); margin: 0.5vw 0;">© ${COMPANY_NAME} 2025</p>
          <div style="padding: 1vw 0;">
            <a href="${FACEBOOK_URL}"><img src=${FACEBOOK} alt="facebook" style="width: clamp(24px, 3vw, 30px); height: clamp(24px, 3vw, 30px); margin: 0 1vw;"></a>
            <a href="${INSTAGRAM_URL}"><img src=${INSTAGRAM} alt="instagram" style="width: clamp(24px, 3vw, 30px); height: clamp(24px, 3vw, 30px); margin: 0 1vw;"></a>
          </div>
        </td>
      </tr>
    </table>
  </div>
`;

const emailOtpVerification = ({ fullName, otp }) => {
  const subject = "Your One-Time Password (OTP) for Verification";
  const body = `
    <div style="color: #2b2b2b; font-size: clamp(14px, 2vw, 18px);  font-family: 'Roboto', sans-serif; font-weight: 400;">
      <p style="text-transform:capitalize;">Hello ${fullName} 👋,</p>
      <p>To ensure the security of your account, please use the following One-Time Password (OTP) for verification:</p>
     
      <div style="text-align: center; margin: 1.2vw 0;">
        <span style="
          display: inline-block;
          padding: 0.5vw 1.5vw;
          letter-spacing: 3px;
          border: 2px dashed #202a4e;
          border-radius: 5px;
          background: #f4f4f4;
          font-size: clamp(20px, 4vw, 28px);
          color: #202a4e;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
        ">${otp}</span>
      </div>
      <p>If you did not request this code, please ignore this email</p>
      <p style="margin: 1vw 0;">
        If you have any questions or need further assistance, feel free to reach out to us at 
        <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> 
        or call us at 
        <a href="tel:${link}" style="color: #202a4e;">${display}</a>. 
      </p>
      <p>Thank you for your attention!</p>
      <p style="margin: 1vw 0;">Best Regards,<br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(body) };
};

const forgotPasswordOtpVerification = (username, otp) => {
  const subject = "Reset Your Password - Use This One-Time Password (OTP)";
  const body = `
    <div style="color: #2b2b2b; font-size: clamp(14px, 2vw, 18px); padding: 1vw 0; font-family: 'Roboto', sans-serif; font-weight: 400;">
      <p>Dear ${username},</p>
      <p>We received a request to reset your password for your account. To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 2vw 0;">
        <span style="
          display: inline-block;
          padding: 0.5vw 1vw;
          margin: 0.5vw;
          letter-spacing: 3px;
          border: 2px solid #2b2b2b;
          border-radius: 10px;
          background: transparent;
          font-size: clamp(20px, 4vw, 28px);
          color: #2b2b2b;
          font-family: 'Roboto', sans-serif;
          font-weight: 500;
        ">${otp.toString().split("").join(" ")}</span>
      </div>
      <p>This OTP can only be used once. If you did not request a password reset, please ignore this email.</p>
      <p style="margin: 1vw 0;">
        If you have any questions or need further assistance, feel free to reach out to us at 
        <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> 
        or call us at 
        <a href="tel:${link}" style="color: #202a4e;">${display}</a>. 
      </p>
      <p>Thank you for your attention!</p>
      <p style="margin: 1vw 0;">Best Regards,<br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(body) };
};

const getMailTemplateForOrderStatus = (userName, orderNumber, trackingNumber, orderStatus) => {
  let subject = "";
  switch (orderStatus) {
    case "pending":
      subject = `Payment Received! Your Order #${orderNumber} is Under Review`;
      break;
    case "cancelled":
      subject = `Order Cancellation and Refund Process for Order #${orderNumber}`;
      break;
    case "confirmed":
      subject = `Your Order #${orderNumber} is Confirmed – Payment Received!`;
      break;
    case "delivered":
      subject = `Your Order #${orderNumber} Has Been Delivered`;
      break;
    case "shipped":
      subject = `Your Order #${orderNumber} Has Been Shipped!`;
      break;
    default:
      subject = `Your Order Status Update`;
      break;
  }
  let boldOrderNumber = `<b>Order #${orderNumber}</b>`;
  const description = `
    <div style="padding: 1vw 0; color: #2b2b2b; font-family: 'Roboto', sans-serif; font-weight: 400; font-size: clamp(14px, 2vw, 18px);">
      <p style="margin-bottom: 1vw;  text-transform: capitalize;">Dear ${userName},</p>	
      ${orderStatus === "pending"
      ? `<p>Thank you for choosing ${COMPANY_NAME}! We're happy to confirm that we’ve received your payment for ${boldOrderNumber}.</p>
          <div style="margin: 1vw 0;">
            <p style="color: #202a4e; margin: 0;">Order Summary</p>
            <ul style="font-size: clamp(14px, 2vw, 18px);">
              <li>Order Number: ${orderNumber}</li>
              <li>Current Status: Pending Review</li>
              <li>Payment Status: Confirmed</li>
            </ul>
          </div>
          <p>Our team is reviewing your order, and we’ll keep you updated once it’s ready for the next steps. Should you have any questions or need further information, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>We appreciate your trust in ${COMPANY_NAME} and look forward to completing your order soon.</p>`
      : ""}
      ${orderStatus === "cancelled"
      ? `<p>We regret to inform you that your ${boldOrderNumber} has been cancelled. We understand this may be disappointing, and we apologize for any inconvenience caused.</p>
          <div style="margin: 1vw 0;">
            <p style="color: #202a4e; margin: 0;">Order Summary</p>
            <ul style="font-size: clamp(14px, 2vw, 18px);">
              <li>Order Number: ${orderNumber}</li>
              <li>Payment Status: In Process</li>
              <li>Order Status: Cancelled</li>
            </ul>
          </div>
          <p>A full refund will be processed to your original payment method within 24 hours. If you have any questions or concerns regarding this cancellation or refund, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for being so understanding, and we hope to have the opportunity to serve you again in the future.</p>`
      : ""}
      ${orderStatus === "confirmed"
      ? `<p>Thank you for your purchase with ${COMPANY_NAME}! We’re excited to confirm that your ${boldOrderNumber} has been successfully placed, and we’ve received your payment.</p>
          <div style="margin: 1vw 0;">
            <p style="color: #202a4e; margin: 0;">Order Summary</p>
            <ul style="font-size: clamp(14px, 2vw, 18px);">
              <li>Order Number: ${orderNumber}</li>
              <li>Payment Status: Confirmed</li>
              <li>Order Status: Confirmed and Processing</li>
            </ul>
          </div>
          <p>We are now preparing your order and will notify you once it has been shipped. If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for choosing ${COMPANY_NAME}. We look forward to delivering your order soon!</p>`
      : ""}
      ${orderStatus === "shipped"
      ? `<p>Great news! Your ${boldOrderNumber} has been shipped and is on its way to you.</p>
            ${trackingNumber
        ? `<p style="margin: 0 0 16px;">
       You can track your order using the following tracking number: <strong>${trackingNumber}</strong>.
     </p>`
        : ""}

          <p>If you have any questions or need assistance, please feel free to contact us at 
          <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at 
          <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for shopping with us, and we hope you enjoy your purchase!</p>`
      : ""}
      ${orderStatus === "delivered"
      ? `<p>We’re happy to let you know that your ${boldOrderNumber} has been successfully delivered.</p>
          <p>We hope you enjoy your purchase. If you have any questions or concerns about your order, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for shopping with ${COMPANY_NAME}! We look forward to serving you again soon!</p>`
      : ""}
      <p style="margin: 1vw 0;">Best Regards, <br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(description) };
};

const getMailTemplateForAppointmentStatus = (
  userName,
  appointmentStatus,
  dateTime,
  rejectReason
) => {
  let subject = "";
  switch (appointmentStatus) {
    case "approved":
      subject = `Your Appointment is Confirmed`;
      break;
    case "rejected":
      subject = `Appointment Request Declined`;
      break;
    default:
      subject = `Your Appointment Update`;
      break;
  }
  const description = `
    <div style="padding: 1vw 0; color: #2b2b2b; font-family: 'Roboto', sans-serif; font-weight: 400; font-size: clamp(14px, 2vw, 18px);">
      <p style="margin-bottom: 1vw;">Dear ${userName},</p>
      ${appointmentStatus === "approved"
      ? `<p>We’re pleased to confirm your appointment with ${COMPANY_NAME}!</p> 
          <div style="margin: 1vw 0;">
            <p style="color: #202a4e; margin: 0;">Appointment Details:</p>
            <ul style="font-size: clamp(14px, 2vw, 18px);">
              <li>Date & Time: ${dateTime}</li>
            </ul>
          </div>
          <p>We look forward to seeing you then. If you have any questions or need to reschedule, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for choosing ${COMPANY_NAME}!</p>`
      : ""}
      ${appointmentStatus === "rejected"
      ? `<p>Thank you for reaching out to us regarding your appointment request. We appreciate your interest in ${COMPANY_NAME}.</p>
          <p>Unfortunately, we must decline your appointment request for ${dateTime}${rejectReason ? `, ${rejectReason}` : ""}. We apologize for any inconvenience this may cause.</p>
          <p>If you have any questions or need further clarification, please don’t hesitate to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
          <p>Thank you for your understanding, and we hope to connect with you soon!</p>`
      : ""}
      <p style="margin: 1vw 0;">Best Regards,<br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(description) };
};

const getMailTemplateForReturnStatus = (
  userName,
  orderNumber,
  returnStatus,
  adminNote = "",
  shippingLabel = ""
) => {
  let subject = "";
  switch (returnStatus) {
    case "pending":
      subject = `Return Request for Order #${orderNumber} is Pending`;
      break;
    case "approved":
      subject = `Return Request Accepted for Order #${orderNumber}`;
      break;
    case "cancelled":
      subject = `Return Request Cancelled for Order #${orderNumber}`;
      break;
    case "rejected":
      subject = `Return Request Update for Order #${orderNumber}`;
      break;
    case "received":
      subject = `Return Received for Order #${orderNumber}`;
      break;
    default:
      subject = `Your Return Order Update`;
      break;
  }
  let shippingLabelSection = "";
  let boldOrderNumber = `<b>Order #${orderNumber}</b>`;
  if (returnStatus === "approved" && shippingLabel) {
    shippingLabelSection = `
      <p style="margin: 1vw 0;">To return your item, please use the latest shipping label provided below:</p>
      <p style="margin: 1vw 0;"><b style="color: #202a4e;">Shipping Label:</b> <a href="${shippingLabel}" style="color: #2b2b2b;" target="_blank">Click here to download your shipping label</a></p>
      <p>Make sure to print and attach the label securely to your package.</p>
    `;
  }
  const description = `
    <div style="padding: 1vw 0; color: #2b2b2b; font-family: 'Roboto', sans-serif; font-weight: 400; font-size: clamp(14px, 2vw, 18px);">
      <p style="margin-bottom: 1vw;">Dear ${userName},</p>
      ${returnStatus === "approved"
      ? `<p>We’re happy to inform you that your return request for ${boldOrderNumber} has been accepted!</p>`
      : returnStatus === "rejected"
        ? `<p>Thank you for contacting us regarding your return request for ${boldOrderNumber}. We appreciate your understanding as we carefully review all return inquiries.</p>
            <p>Unfortunately, we are unable to process your return at this time. We understand this may be disappointing, and we truly apologize for any inconvenience this may cause.</p>
            ${adminNote ? `<p style="margin: 1vw 0;"><strong>Note from Admin:</strong> ${adminNote}</p>` : ""}`
        : returnStatus === "received"
          ? `<p>We wanted to let you know that we’ve successfully received your returned ${boldOrderNumber}.</p>`
          : returnStatus === "pending"
            ? `<p>We have received your return request for ${boldOrderNumber}. Your request is currently being reviewed, and we will update you as soon as the process is complete.</p>`
            : returnStatus === "cancelled"
              ? `<p>We’re writing to inform you that your return request for ${boldOrderNumber} has been cancelled.</p>`
              : ""}
      ${shippingLabelSection}
      ${returnStatus === "approved"
      ? `<p style="margin: 1vw 0;">If you have any questions or need assistance, don’t hesitate to reach out at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>`
      : returnStatus === "rejected"
        ? `<p style="margin: 1vw 0;">If you have any questions or need further clarification, please don’t hesitate to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>. We're here to help!</p>`
        : returnStatus === "received"
          ? `<p style="margin: 1vw 0;">Our team is now reviewing the item(s), and we will notify you once the return process is complete. If you have any questions in the meantime, feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>`
          : returnStatus === "pending"
            ? `<p style="margin: 1vw 0;">If you have any questions or need assistance in the meantime, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>`
            : returnStatus === "cancelled"
              ? `<p style="margin: 1vw 0;">If you have any questions or need further clarification, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>`
              : ""}
      <p style="margin: 1vw 0;">Thank you for choosing <a href="${WEBSITE_URL}" style="color: #202a4e;" target="_blank">${COMPANY_NAME}</a>. Please Visit Again.</p>
      <p style="margin: 1vw 0;">Best Regards, <br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(description) };
};

const getMailTemplateForRefundStatus = (
  userName,
  orderNumber,
  refundStatus
) => {
  let boldOrderNumber = `<b>Order #${orderNumber}</b>`;
  let subject;
  switch (refundStatus) {
    case "pending_refund":
      subject = `Refund Request Processing for Order #${orderNumber}`;
      break;
    case "refunded":
      subject = `Your Refund for Order #${orderNumber} is Successful`;
      break;
    case "cancelled_refund":
      subject = `Refund Request Cancelled`;
      break;
    case "refund_initialization_failed":
      subject = `Refund Initialization Failed for Order #${orderNumber}`;
      break;
    case "failed_refund":
      subject = `Refund Processing Failed for Order #${orderNumber}`;
      break;
    default:
      subject = `Update on Your Refund Request for Order #${orderNumber}`;
      break;
  }

  let description = `
    <div style="padding: 1vw 0; color: #2b2b2b; font-family: 'Roboto', sans-serif; font-weight: 400; font-size: clamp(14px, 2vw, 18px);">
      <p style="margin-bottom: 1vw;">Dear ${userName},</p>`;
  if (refundStatus === "refunded") {
    description += `<p>We are pleased to inform you that your refund for ${boldOrderNumber} has been successfully processed. The refunded amount will be credited back to your original payment method within 24 Hours.</p>`;
  } else if (refundStatus === "pending_refund") {
    description += `<p>We want to let you know that we are currently processing your refund request for ${boldOrderNumber}.</p>`;
  } else if (refundStatus === "cancelled_refund") {
    description += `<p>We want to inform you that your refund request for ${boldOrderNumber} has been cancelled.</p>`;
  } else if (refundStatus === "refund_initialization_failed") {
    description += `<p>We regret to inform you that we encountered an issue while attempting to process your refund for ${boldOrderNumber}.</p>`;
  } else if (refundStatus === "failed_refund") {
    description += `<p>We perspective: We regret to inform you that the refund for ${boldOrderNumber} could not be processed.</p>`;
  } else {
    description += `<p>We hope this message finds you well. We regret to inform you that we are currently unable to process your refund request for ${boldOrderNumber} due to an unknown error.</p>
      <p>We understand how important this matter is and are actively working to resolve the issue. We will keep you updated on any progress.</p>`;
  }

  description += `
      <p style="margin: 1vw 0;">
        ${refundStatus === "refund_initialization_failed"
      ? `We are actively working to resolve the issue and will keep you updated on the status. If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.`
      : refundStatus === "failed_refund"
        ? `Our team is investigating the issue, and we will notify you as soon as the refund can be successfully processed. If you have any questions or require further assistance, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.`
        : `If you have any questions or need further assistance, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>. We’re here to help!`}
      </p>
      ${refundStatus === "refunded"
      ? "<p>Thank you for your patience, and we hope to serve you again in the future!</p>"
      : refundStatus === "pending_refund"
        ? "<p>Thank you for your patience!</p>"
        : refundStatus === "cancelled_refund"
          ? "<p>I appreciate your understanding.</p>"
          : refundStatus === "refund_initialization_failed"
            ? "<p>We apologize for the inconvenience and appreciate your understanding.</p>"
            : refundStatus === "failed_refund"
              ? "<p>We apologize for any inconvenience and appreciate your patience as we work to resolve this.</p>"
              : "<p>Thank you for your understanding and patience.</p>"}
      <p style="margin: 1vw 0;">Best Regards,<br />${COMPANY_NAME}</p>
    </div>
  `;
  return { subject, description: html(description) };
};

const contactUsEmail = ({ fullName }) => {
  const subject = `Thank You for Reaching Out!`;
  const body = `
    <div style="color: #2b2b2b; font-size: clamp(14px, 2vw, 18px); padding: 1vw 0; font-family: 'Roboto', sans-serif; font-weight: 400;">
      <p style="color: #2b2b2b; font-size: clamp(20px, 4vw, 28px); font-weight: 600; margin-bottom: 1vw;">
        Hello ${fullName} 👋,
      </p>
      <p>
        Thank you for contacting <strong>${COMPANY_NAME}</strong>! We have received your message and appreciate you reaching out to us.
      </p>
      <p>
        Our team is reviewing your inquiry and will get back to you as soon as possible. In the meantime, if you have any additional questions or details to share, feel free to reply to this email.
      </p>
      <p>
        For immediate assistance, you can also call us at 
        <a href="tel:${link}" style="color: #202a4e;">${display}</a> 
        or email us directly at 
        <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a>.
      </p>
      <p>
        We truly value your interest and look forward to assisting you!
      </p>
      <p style="margin: 1vw 0;">
        Best regards,<br />
        <strong>${COMPANY_NAME}</strong>
      </p>
    </div>
  `;
  return { subject, description: html(body) };
};

const discountEmail = ({ userName, discount, status, isSignUp = false }) => {
  const subjectMap = {
    active: `🎉 Your Exclusive Discount from ${COMPANY_NAME} is Now Active!`,
    scheduled: `⏳ Your Discount from ${COMPANY_NAME} Will Start Soon!`,
    expired: `⚠️ Your Discount from ${COMPANY_NAME} Has Expired`,
  };

  const introMap = {
    active: `We're excited to let you know that your exclusive discount is now live!`,
    scheduled: `Good news! Your exclusive discount is scheduled to begin soon.`,
    expired: `We’d like to inform you that your previous discount has now expired.`,
  };

  const formattedDate = (dateString) => {
    if (!dateString) return "No expiration date";
    return moment(dateString, "MM-DD-YYYY HH:mm").format("MMMM Do, YYYY [at] hh:mm A");
  };

  const subject = subjectMap[status] || `Your Discount Update from ${COMPANY_NAME}`;
  const startsAtFormatted = formattedDate(discount?.dateRange?.beginsAt);
  const expiresAtFormatted = formattedDate(discount?.dateRange?.expiresAt);

  const discountAmount =
    discount?.discountDetails?.type === "Percentage"
      ? `${discount?.discountDetails?.amount}% Off`
      : `$${discount?.discountDetails?.amount} Off`;
  const welcomeBlock = isSignUp ? `
    <p>Welcome to <strong>${COMPANY_NAME}</strong>! Thank you for joining our community of jewelry enthusiasts. We're thrilled to have you with us!</p>
    <p>To celebrate your new account, we're excited to offer you an exclusive <strong>Sign Up Discount</strong></p>
  ` : null;
  const body = `
    <div style="color: #2b2b2b; font-size: clamp(14px, 2vw, 18px); font-family: 'Roboto', sans-serif; font-weight: 400; line-height: 1.6; padding: 1vw 0;">
      <p style="text-transform: capitalize;">Dear ${userName},</p>
      <p>${introMap[status]}</p>

      ${welcomeBlock}
      
      ${status === 'scheduled' ? `
        <p><strong>Offer Starts On:</strong> ${startsAtFormatted}</p>
      ` : ''}

      ${status !== 'expired' ? `
        <p><strong>Use the promo code below to enjoy your discount:</strong></p>
        <div style="text-align: center; margin: 1.5vw 0;">
          <span style="
            display: inline-block;
            padding: 0.5vw 1.5vw;
            letter-spacing: 2px;
            border: 2px dashed #202a4e;
            border-radius: 8px;
            background: #f0f0f0;
            font-size: clamp(20px, 4vw, 28px);
            color: #202a4e;
            font-weight: 600;
          ">${discount?.promoCode}</span>
        </div>

        <p><strong>Discount Details:</strong></p>
        <ul>
          <li><strong>Amount:</strong> ${discountAmount}</li>
          <li><strong>Valid Until:</strong> ${expiresAtFormatted}</li>
          ${discount?.minimumOrderValue ? `<li><strong>Minimum Order Value:</strong> $${discount.minimumOrderValue}</li>` : ""}
          <li><strong>Applicable On:</strong> ${discount?.purchaseMode || "All"} purchases</li>
        </ul>

        <p style="text-align: center; margin: 2vw 0;">
          <a href="${WEBSITE_URL}" style="
            display: inline-block;
            padding: 1vw 2vw;
            background-color: #202a4e;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: 500;
          ">Shop Now</a>
        </p>
      ` : `
        <p>This promotion has ended. But stay tuned — we’ll be launching more exciting offers soon!</p>
      `}

      <p>If you have any questions, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color: #202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${link}" style="color: #202a4e;">${display}</a>.</p>
      <p style="margin-top: 1.5vw;">Best regards,<br/><strong>${COMPANY_NAME}</strong></p>
    </div>
  `;

  return { subject, description: html(body) };
};


module.exports = {
  welcomeTemplate,
  emailOtpVerification,
  forgotPasswordOtpVerification,
  getMailTemplateForOrderStatus,
  getMailTemplateForAppointmentStatus,
  getMailTemplateForReturnStatus,
  getMailTemplateForRefundStatus,
  contactUsEmail,
  discountEmail,
};