const isFirebase = (process.env.FUNCTION_TARGET || process.env.FUNCTION_NAME) && process.env.FUNCTIONS_EMULATOR !== 'true';

const puppeteer = isFirebase ? require("puppeteer-core") : require("puppeteer");
const chromium = isFirebase ? require("@sparticuz/chromium") : null;
const {
  formatCurrencyWithDollar,
  capitalizeCamelCase,
  formatDate,
  SALES_TAX_NOTE,
  generateProductTable,
  processProducts,
} = require("../helpers/common");
const companyInfo = require("./companyInfo");
const { generateHTML } = require("./invoiceTemplate");

const returnInvoiceBody = (invoiceData) => {
  const returnAmount = Number(invoiceData?.returnRequestAmount) || 0;
  const refundAmount = Number(invoiceData?.refundAmount) || 0;
  const deductedAmount = returnAmount - refundAmount;

  return `
    <main class="my-4 w-full">
      <div class="flex justify-between gap-4 mb-4 w-full">
        <div class="w-[300px]">
          <h2 class="text-md font-semibold text-black">Return Details</h2>
          <p class="text-xs">Order Number: ${invoiceData?.orderNumber}</p>
          <p class="text-xs">Return Request Date: ${formatDate(
    invoiceData?.createdDate
  )}</p>
          <p class="text-xs">Return Status: ${capitalizeCamelCase(
    invoiceData?.status
  )}</p>
          <p class="text-xs">Return Payment Status: ${capitalizeCamelCase(
    invoiceData?.paymentStatus
  )}</p>
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
      ${generateProductTable(invoiceData.products, "returnQuantity")}
  <div class="mt-4 text-sm max-w-fit ml-auto">
  <div class="grid grid-cols-[max-content,120px] gap-x-1 text-left">
    <!-- Subtotal -->
    <div>Subtotal</div>
    <div class="text-right">${formatCurrencyWithDollar(invoiceData.subTotal)}</div>

    <!-- Promo Discount -->
    ${invoiceData.discount > 0
      ? `<div>Promo Discount</div>
           <div class="text-right">-${formatCurrencyWithDollar(invoiceData.discount)}</div>`
      : ""
    }

    <!-- Sales Tax -->
    <div>Sales Tax</div>
    <div class="text-right">${invoiceData.salesTax && Number(invoiceData.salesTax) !== 0
      ? formatCurrencyWithDollar(invoiceData.salesTax)
      : "$0.00"
    }</div>

    <!-- Shipping Fees -->
    <div>Shipping Fees</div>
    <div class="text-right">${Number(invoiceData.shippingCharge) > 0
      ? formatCurrencyWithDollar(invoiceData.shippingCharge)
      : "Free"
    }</div>

    <!-- Divider -->
    <div class="col-span-2 border-t border-gray-300 my-2"></div>

    <!-- Conditional amounts -->
    ${returnAmount === refundAmount && refundAmount > 0
      ? `<div class="font-semibold">Refunded Amount</div>
           <div class="font-semibold text-right">${formatCurrencyWithDollar(refundAmount)}</div>`
      : `
          <div>Estimated Amount</div>
          <div class="text-right">${returnAmount > 0 ? formatCurrencyWithDollar(returnAmount) : "$0.00"
      }</div>

          ${refundAmount > 0 && deductedAmount > 0
        ? `<div>Deducted Amount</div>
                 <div class="text-right">${formatCurrencyWithDollar(deductedAmount)}</div>`
        : ""
      }

          ${refundAmount > 0
        ? `<div class="font-semibold">Refunded Amount</div>
                 <div class="font-semibold text-right">${formatCurrencyWithDollar(refundAmount)}</div>`
        : ""
      }
        `
    }
  </div>
</div>
        ${invoiceData.salesTax
      ? `<p class="text-xs text-right text-gray-500 mt-2">${SALES_TAX_NOTE}</p>`
      : ""
    }
    </main>
  `;
};

const returnInovice = async (orderData) => {
  try {
    if (!orderData || !orderData.products) {
      throw new Error("Invalid return data provided");
    }

    const invoiceData = {
      ...orderData,
      products: await processProducts(orderData.products),
    };

    const formattedDate = `Date: ${formatDate(new Date())}`;
    const htmlContent = generateHTML({
      logoUrl: companyInfo?.LOGO,
      formattedDate,
      title: "Return Invoice",
      bodyContent: returnInvoiceBody(invoiceData),
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
    console.error("Return Invoice generation error:", err.message);
    throw err;
  }
};

module.exports = { returnInovice };
