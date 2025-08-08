const isFirebase = !!process.env.FUNCTION_NAME;
const puppeteer = isFirebase ? require("puppeteer-core") : require("puppeteer");
const chromium = isFirebase ? require("@sparticuz/chromium") : null;
const {
  formatCurrencyWithDollar,
  capitalizeCamelCase,
  formatDate,
  SALES_TAX_NOTE,
  generateProductTable,
  processProducts,
  INVOICE_CONFIG,
} = require("../helpers/common");
const { generateHTML } = require("./invoiceTemplate");

const returnInvoiceBody = (invoiceData) => {
  const returnAmount = Number(invoiceData?.returnRequestAmount) || 0;
  const refundAmount = Number(invoiceData?.refundAmount) || 0;
  const deductedAmount = returnAmount - refundAmount;

  return `
    <main class="my-4 w-full">
      <div class="flex justify-between gap-4 mb-4 w-full">
        <div class="w-[300px]">
          <h2 class="text-sm font-medium text-black">Return Details</h2>
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
        <div class="w-[200px]">
          <h2 class="text-sm font-medium text-black">Shipping Address</h2>
          <p class="text-xs">Name: ${
            invoiceData.shippingAddress?.name || ""
          }</p>
          <p class="text-xs">Email: ${
            invoiceData.shippingAddress?.email || ""
          }</p>
          <p class="text-xs">Address: ${
            invoiceData.shippingAddress?.address || ""
          }, ${invoiceData.shippingAddress?.city || ""}, ${
    invoiceData.shippingAddress?.state || ""
  }, ${invoiceData.shippingAddress?.country || ""} - ${
    invoiceData.shippingAddress?.pinCode || ""
  }</p>
          <p class="text-xs">Mobile: ${
            invoiceData.shippingAddress?.mobile || ""
          }</p>
        </div>
      </div>
      ${generateProductTable(invoiceData.products, "returnQuantity")}
      <div class="text-right mt-4 text-sm w-full">
        <p>Subtotal: ${formatCurrencyWithDollar(invoiceData.subTotal)}</p>
        ${
          invoiceData.discount > 0
            ? `<p>Promo Discount: -${formatCurrencyWithDollar(
                invoiceData.discount
              )}</p>`
            : ""
        }
        <p>Sales Tax: ${
          invoiceData.salesTax && Number(invoiceData.salesTax) !== 0
            ? formatCurrencyWithDollar(invoiceData.salesTax)
            : "$0.00"
        }</p>
        <p>Shipping Fees: ${
          Number(invoiceData.shippingCharge) > 0
            ? formatCurrencyWithDollar(invoiceData.shippingCharge)
            : "Free"
        }</p>
        <div class="border-t border-gray-300 w-32 ml-auto my-2"></div>
        ${
          returnAmount === refundAmount && refundAmount > 0
            ? `<p class="font-bold">Refunded Amount: ${formatCurrencyWithDollar(
                refundAmount
              )}</p>`
            : `
              <p>Estimated Amount: ${
                returnAmount > 0
                  ? formatCurrencyWithDollar(returnAmount)
                  : "$0.00"
              }</p>
              ${
                refundAmount > 0 && deductedAmount > 0
                  ? `<p>Deducted Amount: ${formatCurrencyWithDollar(
                      deductedAmount
                    )}</p>`
                  : ""
              }
              ${
                refundAmount > 0
                  ? `<p class="font-bold">Refunded Amount: ${formatCurrencyWithDollar(
                      refundAmount
                    )}</p>`
                  : ""
              }
            `
        }
        ${
          invoiceData.salesTax
            ? `<p class="text-xs text-gray-500 mt-2">${SALES_TAX_NOTE}</p>`
            : ""
        }
      </div>
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
      logoUrl: INVOICE_CONFIG.LOGO_URL,
      formattedDate,
      title: "Return Invoice",
      bodyContent: returnInvoiceBody(invoiceData),
    });

    const launchOptions = isFirebase
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          timeout: 60000,
        }
      : {
          headless: "new",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
          timeout: 60000,
        };

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
