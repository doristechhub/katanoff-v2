// const isFirebase = !!process.env.FUNCTION_TARGET || !!process.env.FUNCTION_NAME;
const isFirebase = (process.env.FUNCTION_TARGET || process.env.FUNCTION_NAME) && process.env.FUNCTIONS_EMULATOR !== 'true';
const puppeteer = isFirebase ? require("puppeteer-core") : require("puppeteer");
const chromium = isFirebase ? require("@sparticuz/chromium") : null;
const {
  CARD,
  formatCurrencyWithDollar,
  capitalizeCamelCase,
  formatDate,
  SALES_TAX_NOTE,
  generateProductTable,
  processProducts,
} = require("../helpers/common");
const companyInfo = require("./companyInfo");
const { generateHTML } = require("./invoiceTemplate");

const orderInoviceBody = (invoiceData) => {
  const address = invoiceData?.billingAddress;
  const billingAddressText =
    address?.line1 &&
      address?.city &&
      address?.state &&
      address?.country &&
      address?.postal_code
      ? `Billing Address: ${address.line1} ${address.line2 || ""}, ${address.city
      }, ${address.state}, ${address.country} - ${address.postal_code}`
      : "";

  return `
    <main class="my-4 w-full">
      <div class="flex justify-between gap-4 mb-4 w-full">
        <div class="w-[300px]">
          <h2 class="text-md font-semibold text-black">Order Details</h2>
          <p class="text-xs">Order Number: ${invoiceData?.orderNumber}</p>
          <p class="text-xs">Order Date: ${formatDate(
    invoiceData?.createdDate
  )}</p>
          <p class="text-xs">Order Status: ${capitalizeCamelCase(
    invoiceData?.orderStatus
  )}</p>
          <p class="text-xs">Payment Status: ${capitalizeCamelCase(
    invoiceData?.paymentStatus
  )}</p>
          ${invoiceData?.paymentMethodDetails?.type
      ? `
                <h2 class="text-md font-semibold text-black mt-2">Payment Details</h2>
                <p class="text-xs">Payment Method: ${invoiceData.paymentMethodDetails.type === CARD
        ? `${invoiceData.paymentMethodDetails.brand} ending in ${invoiceData.paymentMethodDetails.lastFour}`
        : invoiceData.paymentMethodDetails.type
      }</p>
              `
      : ""
    }
          ${billingAddressText
      ? `<p class="text-xs">${billingAddressText}</p>`
      : ""
    }
        </div>
        <div class="w-[300px] text-right">
          <h2 class="text-md font-semibold text-black">Shipping Address</h2>
          <p class="text-xs">Name: ${invoiceData.shippingAddress?.name || ""
    }</p>
          <p class="text-xs">Email: ${invoiceData.shippingAddress?.email || ""
    }</p>
          <p class="text-xs">Address: ${invoiceData.shippingAddress?.address || ""
    }, ${invoiceData.shippingAddress?.city || ""}, ${invoiceData.shippingAddress?.state || ""
    }, ${invoiceData.shippingAddress?.country || ""} - ${invoiceData.shippingAddress?.pinCode || ""
    }</p>
          <p class="text-xs">Mobile: ${invoiceData.shippingAddress?.mobile || ""
    }</p>
        </div>
      </div>
      ${generateProductTable(invoiceData.products, "cartQuantity")}
      <div class="mt-4 text-sm max-w-fit ml-auto">
 <div class="grid grid-cols-[max-content,120px] gap-x-1 text-left">

    <div>Sub Total</div>
    <div class="text-right">${formatCurrencyWithDollar(invoiceData.subTotal)}</div>

    ${invoiceData.discount > 0
      ? `<div>Promo Discount</div>
           <div class="text-right">-${formatCurrencyWithDollar(invoiceData.discount)}</div>`
      : ""
    }

    <div>Sales Tax ${invoiceData.salesTaxPercentage ? `(${invoiceData.salesTaxPercentage}%)` : ""}</div>
    <div class="text-right">${invoiceData.salesTax && Number(invoiceData.salesTax) !== 0
      ? formatCurrencyWithDollar(invoiceData.salesTax)
      : "$0.00"
    }</div>

    <div>Shipping Fees</div>
    <div class="text-right">${Number(invoiceData.shippingCharge) > 0
      ? formatCurrencyWithDollar(invoiceData.shippingCharge)
      : "Free"
    }</div>

    <div class="col-span-2 border-t border-gray-300 my-2"></div>

    <div class="font-semibold">Total Amount</div>
    <div class="font-semibold text-right">${formatCurrencyWithDollar(invoiceData.total)}</div>
  </div>
  </div>
  ${invoiceData.salesTax
      ? `<p class="text-xs text-gray-500 mt-2 text-right">${SALES_TAX_NOTE}</p>`
      : ""
    }

        
    </main>
  `;
};

const orderInovice = async (orderData) => {
  try {
    if (!orderData || !orderData?.products) {
      throw new Error("Invalid order data provided");
    }

    const invoiceData = {
      ...orderData,
      products: await processProducts(orderData?.products),
    };


    const formattedDate = `Date: ${formatDate(new Date())}`;
    const htmlContent = generateHTML({
      logoUrl: companyInfo?.LOGO,
      formattedDate,
      title: "Invoice",
      bodyContent: orderInoviceBody(invoiceData),
    });
    let launchOptions;

    if (isFirebase) {
      const executablePath = await chromium.executablePath();
      if (!executablePath) {
        throw new Error('Chromium executable path not found');
      }
      launchOptions = {
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: executablePath,
        headless: 'shell',
        timeout: 60000,
      };
    } else {

      launchOptions = {
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
        timeout: 60000,
      };
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      landscape: false,
      printBackground: true,
      margin: { top: "10px", right: "10px", bottom: "10px", left: "10px" },
    });

    await browser.close();
    return pdfBuffer;
  } catch (err) {
    console.error("Order Inovice generation error:", err.message);
    throw err;
  }
};

module.exports = { orderInovice };
