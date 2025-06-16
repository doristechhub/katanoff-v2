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

const headerTemplate = () => `
 <div style="padding :30px 0px; border-bottom : 1px solid #e2e2e2; text-align: center;">
        <a href=${WEBSITE_URL}><img src=${LOGO} alt="Logo" style="width: 200px; height: auto;"></a>
        </div>
`;

const footerTemplate = () => `
	<div style="text-align: center; border-top: 1px solid #e2e2e2;">
 		<p style="font-family: IBM Plex Mono, monospace; color:#2b2b2b;">Follow Us</p>
        <div style="margin: 7px 0;">
            <a href=${FACEBOOK_URL}" style="margin: 0 10px; display: inline-block;">
                <img src=${FACEBOOK} alt="Facebook" style="width: 20px; height: 20px;" />
            </a>
              
            <a href=${INSTAGRAM_URL} style="margin: 0 10px; display: inline-block;">
            	<img src=${INSTAGRAM} alt="Instagram" style="width: 20px; height: 20px;" />
            </a>
        </div>

        <div style="padding: 20px; text-align: center; color: #a5a5a5; font-size: 0.7vw;">
            <p style="margin: 0; font-family: IBM Plex Mono, monospace; font-style: normal;">© 2024 Your ${COMPANY_NAME}. All rights reserved.</p>
            <p style="margin: 0;"><a href="mailto:${COMPANY_EMAIL}" style="font-family: IBM Plex Mono, monospace; font-style: normal; color: #a5a5a5; text-decoration: none;">Mail us: ${COMPANY_EMAIL}</a></p>
        </div>
	</div>
	`;

const html = (body) => {
  return `
	<!DOCTYPE html>
		<html lang="en">
		<head>
    		<meta charset="UTF-8">
    		<meta name="viewport" content="width=device-width, initial-scale=1.0">
    		<title>OTP Email</title>
	
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		
			<link href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap" rel="stylesheet" />
			<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
		</head>
		<body style="background-color: #fafaf8; padding: 100px 15px; font-family: sans-serif;">
    <div style="max-width: 700px; margin: auto; background-color : white; box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.21); background-size: cover; background-position: center; background-repeat: no-repeat; width: auto; border-radius: 10px;">
        ${headerTemplate()}
        <div style="padding: 0px 2vw;">
          ${body}
        </div>
        ${footerTemplate()}
    </div>
</body>

	</html>
	`;
};

const welcomeTemplate = (fullName) => {
  return `<!DOCTYPE html>
	<html>
	<head>
	<title>Page Title</title>
	</head>
	<body>
	<table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;background-color:#f9f9f9" id="bodyTable">
			<tr>
				<td style="padding-right:10px;padding-left:10px;" align="center" valign="top" id="bodyCell">
					<table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperWebview" style="max-width:600px">
						<tbody>
							<tr>
								<td align="center" valign="top">
									<table border="0" cellpadding="0" cellspacing="0" width="100%">
										<tbody>
											<tr>
												<td style="padding-top: 20px; padding-bottom: 20px; padding-right: 0px;" align="right" valign="middle" class="webview">
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
  
					<div style="margin-bottom: 40px;">
					  <img src=${LOGO} alt="logo">
					</div>
					<table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperBody" style="max-width:600px">
						<tbody>
							<tr>
								<td align="center" valign="top">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" class="tableCard" style="background-color:#fff;border-color:#e5e5e5;border-style:solid;border-width:0 1px 1px 1px;">
										<tbody>
											<tr>
												<td style="background-color:#ff6731;font-size:1px;line-height:3px" class="topBorder" height="3">&nbsp;</td>
											</tr>
											<tr>
												<td style="padding-top: 20px; padding-bottom: 10px; padding-left: 20px; padding-right: 20px;" align="center" valign="top" class="mainTitle">
													<h2 class="text" style="color:#000;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:20px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:36px;text-transform:none;text-align:center;padding:0;margin:0">
                                                        Welcome, ${fullName}
                                                    </h2>
												</td>
											</tr>
											<tr>
												<td style="padding-bottom: 30px; padding-left: 20px; padding-right: 20px;" valign="top" class="subTitle">
                                                    <h3 class="text" style="color:#000;font-family:Poppins,Helvetica,Arial,sans-serif;font-size:16px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0">
                                                        Thanks for registering at ${COMPANY_NAME}
                                                    </h3>
                                                    
                                                    <h6 class="text" style="color:#000;font-size:14px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:center;padding:0;margin:0;margin-top: 5px;">
                                                        We are thrilled to have you join our community of jewelry enthusiasts and fashion connoisseurs.<br/>
                                                        At ${COMPANY_NAME}, we believe every piece of jewelry tells a unique story, and we're here to help you find the perfect pieces that resonate with your style and personality.
                                                    </h6>
                                                    <table class="text"
                                                        style="font-size:14px;font-weight:500;font-style:normal;letter-spacing:normal;line-height:24px;text-transform:none;text-align:justify;padding:0;margin:0;">
                                                        <tr>
                                                            <td style="padding-top: 5px;">Here's what you can look forward to:</td>
                                                        </tr>
                                                        <tr>
                                                            <td>✨ Explore our curated collection of exquisite jewelry, handpicked for you.</td>
                                                        </tr>
                                                        <tr>
                                                            <td>✨ Stay updated on the latest trends, exclusive offers, and access to limited editions.</td>
                                                        </tr>
                                                        <tr>
                                                            <td>✨ Personalized recommendations tailored to your unique taste.</td>
                                                        </tr>
                                                        <tr>
                                                            <td>✨ Hassle-free shopping experience with secure transactions and speedy delivery.</td>
                                                        </tr>
                                                    </table>
                                                    <p style="text-align: center; padding-top: 15px;">
                                                        Feel free to reach out to our dedicated customer support team if you have any questions or need assistance.
                                                        We're here to make your jewelry journey unforgettable!
                                                    </p>
												</td>
											</tr>
										</tbody>
									</table>

									<table border="0" cellpadding="0" cellspacing="0" width="100%" class="space">
										<tbody>
											<tr>
												<td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
                                                
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapperFooter" style="max-width:600px">
						<tbody>
							<tr>
								<td align="center" valign="top">
									<table border="0" cellpadding="0" cellspacing="0" width="100%" class="footer">
										<tbody>
											<tr>
                                                <td style="padding-top: 20px" align="center" valign="top" class="brandInfo">
                                                  <span class="text">Happy Shopping,</span>  
                                                
                                                  <p class="text" style="color:#bbb;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;font-style:normal;letter-spacing:normal;text-transform:none;text-align:center;padding:0;margin:0;margin-top:5px">
                                                      ©&nbsp; ${COMPANY_NAME} 2024
                                                  </p>
                                                </td>
                                            </tr>
                                            <tr align="center"> 
                                                <td style="padding-top:15px">
													<a href="/"><img src=${FACEBOOK} alt="facebook" height="30px" width="30px"></a>
													<a href="/"><img src=${INSTAGRAM} alt="instagram" height="30px" width="30px"></a>
                                                </td>
                                            </tr>
											<tr>
												<td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
							<tr>
								<td style="font-size:1px;line-height:1px" height="30">&nbsp;</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
	</body>
	</html>`;
};

const emailOtpVerification = (otp) => {
  const subject = "Your One-Time Password (OTP) for Verification";
  const body = `

		<div style="color: #2b2b2b; font-size: 1vw; padding:0px 2vw; font-family: IBM Plex Mono, monospace; padding: 25px 0 30px 0; font-style: normal; ">
			<p>
				Hello,
			</p>
			<p>
				To ensure the security of your account, please use the following One-Time Password (OTP) for verification:
			</p>
		
			<div style="text-align: center;">
    <span style="
      display: inline-block;
      padding: 2px 5px;
      margin: 5px;
      letter-spacing: 3px;
      border: 1px solid #d4d4d4;
      border-radius: 5px;
      background: transparent;
      font-size: 24px;
      color: #202a4e;
      text-align: center;
      font-family: sans-serif;
    ">${otp}</span>
</div>

			<p>
				If you did not request this code, please ignore this email
			</p>
			<p style="margin : 10px 0px;">
				If you have any questions or need further assistance, feel free to reach out to us at 
				<a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> 
					${COMPANY_EMAIL}
				</a> 
				or call us at 
				<a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">
				${COMPANY_MOBILE_NO}
				</a>. 
			</p>
			<p>
				Thank you for your attention!
			</p>
			<p style="margin-bottom : 10px; ">Best Regards,<br />${COMPANY_NAME}</p>
      	</div>`;

  return { subject, description: html(body) };
};

const forgotPasswordOtpVerification = (username, otp) => {
  const subject = "Reset Your Password - Use This One-Time Password (OTP)";
  const body = `
	 
	<div style="color: white; font-size: 1vw; padding:0px 2vw; font-family: IBM Plex Mono, monospace; padding: 25px 0 15px 0; font-style: normal; ">
		<p>
			Dear ${username},
		</p>
		<p>
			We received a request to reset your password for your account. To proceed with resetting your password, please use the following One-Time Password (OTP):
		</p>
	
		<div style=" text-align: center;">
			<button style="text-align: center; margin : 10px 0; border: 2px solid white; border-radius : 10px; padding : 5px 11px;	background : transparent; font-size : 20px; color : white;">
				${otp.toString().split("").join(" ")}
			</button>
		</div>

		<p>
			can only be used once. If you did not request a password reset, please ignore this email.
		</p>
		<p style="margin : 10px 0px;">
			If you have any questions or need further assistance, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>. 
		</p>
		<p>
			Thank you for your attention!
		</p>
		<p style="margin-bottom : 10px; ">Best Regards,<br />${COMPANY_NAME}</p>
      </div>`;

  return { subject, description: html(body) };
};

const getMailTemplateForOrderStatus = (userName, orderNumber, orderStatus) => {
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
	<div style="padding: 25px 0 15px 0;	">
	<div style="padding : 0px 2vw; color: white;  font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;">

	<p style=" margin-bottom : 10px;">Dear ${userName},</p>	
	${
    orderStatus === "pending"
      ? `<p>Thank you for choosing ${COMPANY_NAME}! We're happy to confirm that we’ve received your payment for ${boldOrderNumber}.</p>
			<div style="margin : 10px;">
				<p style="color :#202a4e; margin : 0px;">Order Summary</p>
				<ul>
					<li>Order Number : ${orderNumber}</li>
					<li>Current Status : Pending Review</li>
					<li>Payment Status : Confirmed</li>
				</ul>
			</div>
			<p>Our team is reviewing your order, and we’ll keep you updated once it’s ready for the next steps. Should you have any questions or need further information, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>We appreciate your trust in
${COMPANY_NAME}
and look forward to completing your order soon.</p>
			`
      : ""
  }
	  
	  ${
      orderStatus === "cancelled"
        ? `<p>We regret to inform you that your
${boldOrderNumber}
has been cancelled. We understand this may be disappointing, and we apologize for any inconvenience caused.</p>
			<div style="margin : 10px;">
				<p style="color :#202a4e; margin : 0px;">Order Summary</p>
				<ul>
					<li>Order Number : ${orderNumber}</li>
					<li>Payment Status : In Process</li>
					<li>Order Status : cancelled</li>
				</ul>
			</div>
			<p>A full refund will be processed to your original payment method within
24 hours. If you have any questions or concerns regarding this cancellation or refund, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>Thank you for being so understanding, and we hope to have the opportunity to serve you again in the future.</p>
			`
        : ""
    }
	  
	  ${
      orderStatus === "confirmed"
        ? `<p>Thank you for your purchase with ${COMPANY_NAME}! We’re excited to confirm that your ${boldOrderNumber} has been successfully placed, and we’ve received your payment.
 </p>
			<div style="margin : 10px;">
				<p style="color :#202a4e; margin : 0px;">Order Summary</p>
				<ul>
					<li>Order Number : ${orderNumber}</li>
					<li>Payment Status : Confirmed</li>
					<li>Order Status : Confirmed and Processing</li>
				</ul>
			</div>
			<p>We are now preparing your order and will notify you once it has been shipped. If you have any questions in the meantime, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>Thank you for choosing ${COMPANY_NAME}. We look forward to delivering your order soon!</p>`
        : ""
    }
		 ${
       orderStatus === "shipped"
         ? `<p>Great news! Your ${boldOrderNumber} has been shipped and is on its way to you.</p>
			
			<p>If you have any questions or need assistance, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>Thank you for shopping with us, and we hope you enjoy your purchase!</p>`
         : ""
     }
		${
      orderStatus === "delivered"
        ? `<p>We’re happy to let you know that your ${boldOrderNumber} has been successfully delivered.</p>
			
			<p>We hope you enjoy your purchase. If you have any questions or concerns about your order, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>Thank you for shopping with ${COMPANY_NAME}!. We look forward to serving you again soon!</p>`
        : ""
    }
	<p style = "margin-bottom : 10px; " >Best Regards, <br />${COMPANY_NAME}</p>
	</div >
      </div >
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
	<div style = "padding: 25px 0 15px 0;" >
		<div style="padding : 0px 2vw; color: white;  font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;">
			<p style=" margin-bottom : 10px;">Dear ${userName},</p>
			
				${
          appointmentStatus === "approved"
            ? `<p>We’re pleased to confirm your appointment with ${COMPANY_NAME}!</p> <div style="margin : 10px;">
				<p style="color :#202a4e; margin : 0px;">Appointment Details :</p>
				<ul>
					<li>Date & Time: ${dateTime}</li>
				</ul>
			</div>
			<p>We look forward to seeing you then. If you have any questions or need to reschedule, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
			<p>Thank you for choosing ${COMPANY_NAME}!</p>`
            : ""
        }
					${
            appointmentStatus === "rejected"
              ? `	<p>Thank you for reaching out to us regarding your appointment request. We appreciate your interest in ${COMPANY_NAME}.</p>
				<p>Unfortunately, we must decline your appointment request for ${dateTime}${
                  rejectReason ? `, ${rejectReason}` : ""
                }. We apologize for any inconvenience this may cause.</p>
			   	<p>If you have any questions or need further clarification, please don’t hesitate to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;"> ${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>
				<p>Thank you for your understanding, and we hope to connect with you soon!</p>`
              : ""
          }
			<p style="margin-bottom : 10px;">Best Regards,<br />${COMPANY_NAME}</p>
		</div>
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
      subject = `Return Request Accepted for Order  #${orderNumber}`;
      break;
    case "cancelled":
      subject = `Return Request Cancelled for Order  #${orderNumber}`;
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
	<p style="margin-top: 10px;">To return your item, please use the latest shipping label provided below:</p>
	      <p style="margin : 10px 0;"><b style="color :#202a4e;">Shipping Label :</b> <a href="${shippingLabel}" style="color : white;" target="_blank">Click here to download your shipping label</a></p>
	      <p>Make sure to print and attach the label securely to your package.</p>
`;
  }
  const description = `
	<div style="padding: 25px 0 15px 0;" >
		<div style="padding : 0px 2vw; color: white;  font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;">
			<p style="margin-bottom : 10px;">Dear ${userName},</p>

			${
        returnStatus === "approved"
          ? `<p>We’re happy to inform you that your return request for ${boldOrderNumber} has been accepted!</p>`
          : returnStatus === "rejected"
          ? `<p>Thank you for contacting us regarding your return request for ${boldOrderNumber}. We appreciate your understanding as we carefully review all return inquiries.</p>
					 <p>Unfortunately, we are unable to process your return at this time. We understand this may be disappointing, and we truly apologize for any inconvenience this may cause.</p>
					 ${
             adminNote
               ? `<p style="margin-top:10px;"><strong>Note from Admin:</strong> ${adminNote}</p>`
               : ""
           }`
          : returnStatus === "received"
          ? `<p>We wanted to let you know that we’ve successfully received your returned ${boldOrderNumber}.</p>`
          : returnStatus === "pending"
          ? `<p>We have received your return request for ${boldOrderNumber}. Your request is currently being reviewed, and we will update you as soon as the process is complete.</p>`
          : returnStatus === "cancelled"
          ? `<p>We’re writing to inform you that your return request for ${boldOrderNumber} has been cancelled.</p>`
          : ""
      }

			${shippingLabelSection}
			
			${
        returnStatus === "approved"
          ? `<p style="margin : 10px 0;">If you have any questions or need assistance, don’t hesitate to reach out at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>`
          : returnStatus === "rejected"
          ? `<p style="margin : 10px 0;">If you have any questions or need further clarification, please don’t hesitate to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>. We're here to help!</p>`
          : returnStatus === "received"
          ? `<p style="margin : 10px 0;">Our team is now reviewing the item(s), and we will notify you once the return process is complete. If you have any questions in the meantime, feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>`
          : returnStatus === "pending"
          ? `<p style="margin : 10px 0;">If you have any questions or need assistance in the meantime, feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>`
          : returnStatus === "cancelled"
          ? `<p style="margin : 10px 0;">If you have any questions or need further clarification, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color :#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.</p>`
          : ""
      }
			  
				<p style = "color: white; margin-bottom : 10px; font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;" > Thank you for choosing <a href="${WEBSITE_URL}" style="color:#202a4e;" target="_blank" >${COMPANY_NAME}<a/> Please Visit Again.</p>
		<p style = "color: white; margin-bottom : 10px; font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;" > Best Regards, <br />${COMPANY_NAME}</p>
		</div >
      </div >
	`;
  return { subject, description: html(description) };
};

const getMailTemplateForRefundStatus = (
  userName,
  orderNumber,
  refundStatus // refunded, pending_refund, failed_refund, cancelled_refund, refund_initialization_failed
) => {
  let boldOrderNumber = `<b> Order #${orderNumber}</b>`;
  let subject;
  switch (refundStatus) {
    case "pending_refund":
      subject = `Refund Request Processing for Order #${orderNumber}`;
      break;
    case "refunded":
      subject = `Your Refund for Order Order #${orderNumber} is Successful`;
      break;
    case "cancelled_refund":
      subject = `Refund Request cancelled`;
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
	<div div style = "padding: 25px 0 15px 0;">
		<div style="padding : 0px 2vw; color: white;  font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;">
			<p style="margin-bottom : 10px;">Dear ${userName},</p>`;
  if (refundStatus === "refunded") {
    description += `<p>We are pleased to inform you that your refund for
Order #${orderNumber}
has been successfully processed. The refunded amount will be credited back to your original payment method within 24 Hours.</p>`;
  } else if (refundStatus === "pending_refund") {
    description += `<p> We want to let you know that we are currently processing your refund request for ${boldOrderNumber}.</p> `;
  } else if (refundStatus === "cancelled_refund") {
    description += `<p> We want to inform you that your refund request for ${boldOrderNumber} has been cancelled.</p> `;
  } else if (refundStatus === "refund_initialization_failed") {
    description += `<p>We regret to inform you that we encountered an issue while attempting to process your refund for
Order ${boldOrderNumber}.</p>`;
  } else if (refundStatus === "failed_refund") {
    description += `<p>We regret to inform you that the refund for ${boldOrderNumber} could not be processed.</p> `;
  } else {
    description += `<p> We hope this message finds you well. We regret to inform you that we are currently unable to process your refund request for ${boldOrderNumber} due to an unknown error.</p>
			<p>We understand how important this matter is and are actively working to resolve the issue. We will keep you updated on any progress.</p>
		`;
  }

  description += `
			<p style="margin: 10px 0;"> 
				${
          refundStatus === "refund_initialization_failed"
            ? `We are actively working to resolve the issue and will keep you updated on the status. If you have any questions or need assistance, please feel free to reach out to us at <a href="mailto:${COMPANY_EMAIL}" style="color:#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.`
            : refundStatus === "failed_refund"
            ? `Our team is investigating the issue, and we will notify you as soon as the refund can be successfully processed. If you have any questions or require further assistance, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color:#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>.`
            : `If you have any questions or need further assistance, please feel free to contact us at <a href="mailto:${COMPANY_EMAIL}" style="color:#202a4e;">${COMPANY_EMAIL}</a> or call us at <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a>. We’re here to help!`
        }
			</p> 
			${
        refundStatus === "refunded"
          ? "<p>Thank you for your patience, and we hope to serve you again in the future!</p>"
          : refundStatus === "pending_refund"
          ? "<p>Thank you for your patience!</p>"
          : refundStatus === "cancelled_refund"
          ? "<p>I appreciate your understanding.</p>"
          : refundStatus === "refund_initialization_failed"
          ? "<p>We apologize for the inconvenience and appreciate your understanding.</p>"
          : refundStatus === "failed_refund"
          ? "<p>We apologize for any inconvenience and appreciate your patience as we work to resolve this.</p>"
          : "<p>Thank you for your understanding and patience.</p>"
      }
		<p style="color: white; margin-bottom : 10px; font-family: IBM Plex Mono, monospace; font-style: normal; font-size: 1vw;">Best Regards,<br />${COMPANY_NAME}</p>
		</div >
      </div >
	`;
  return { subject, description: html(description) };
};

const contactUsEmail = ({ fullName }) => {
  const subject = `Thank You for Reaching Out!`;

  const body = `
    	<div style="color: white; font-size: 1vw; padding:0px 2vw; font-family: IBM Plex Mono, monospace; padding: 25px 0 15px 0; font-style: normal; ">
			 <p class="name" style="color: white; font-size: 30px; font-weight: 600; ">
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
        <a href="tel:${COMPANY_MOBILE_NO}" style="color:#202a4e;">${COMPANY_MOBILE_NO}</a> 
        or email us directly at 
        <a href="mailto:${COMPANY_EMAIL}" style="color:#202a4e;">${COMPANY_EMAIL}</a>.
      </p>  
      <p>
       We truly value your interest and look forward to assisting you!
      </p>
		  <p style="margin-top: 20px;">
        Best regards,<br />
        <strong>${COMPANY_NAME}</strong>
      </p>
      	</div>
  `;

  return { subject, description: html(body) };
};
module.exports = {
  welcomeTemplate,
  emailOtpVerification,
  // forgotPasswordOtpVerification,
  getMailTemplateForOrderStatus,
  getMailTemplateForAppointmentStatus,
  getMailTemplateForReturnStatus,
  getMailTemplateForRefundStatus,
  contactUsEmail,
};
