const isFirebase = !!process.env.FUNCTION_NAME;
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
  INVOICE_CONFIG,
} = require("../helpers/common");
const { generateHTML } = require("./invoiceTemplate");

const orderInoviceBody = (invoiceData) => {
  const address = invoiceData?.billingAddress;
  const billingAddressText =
    address?.line1 &&
    address?.city &&
    address?.state &&
    address?.country &&
    address?.postal_code
      ? `Billing Address: ${address.line1} ${address.line2 || ""}, ${
          address.city
        }, ${address.state}, ${address.country} - ${address.postal_code}`
      : "";

  return `
    <main class="my-4 w-full">
      <div class="flex justify-between gap-4 mb-4 w-full">
        <div class="w-[300px]">
          <h2 class="text-sm font-medium text-black">Order Details</h2>
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
          ${
            invoiceData?.paymentMethodDetails?.type
              ? `
                <h2 class="text-sm font-medium text-black mt-2">Payment Details</h2>
                <p class="text-xs">Payment Method: ${
                  invoiceData.paymentMethodDetails.type === CARD
                    ? `${invoiceData.paymentMethodDetails.brand} ending in ${invoiceData.paymentMethodDetails.lastFour}`
                    : invoiceData.paymentMethodDetails.type
                }</p>
              `
              : ""
          }
          ${
            billingAddressText
              ? `<p class="text-xs">${billingAddressText}</p>`
              : ""
          }
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
      ${generateProductTable(invoiceData.products, "cartQuantity")}
      <div class="text-right mt-4 text-sm w-full">
        <p>Sub Total: ${formatCurrencyWithDollar(invoiceData.subTotal)}</p>
        ${
          invoiceData.discount > 0
            ? `<p>Promo Discount: -${formatCurrencyWithDollar(
                invoiceData.discount
              )}</p>`
            : ""
        }
        <p>Sales Tax ${
          invoiceData.salesTaxPercentage
            ? `(${invoiceData.salesTaxPercentage}%)`
            : ""
        }: ${
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
        <p class="font-bold">Total Amount: ${formatCurrencyWithDollar(
          invoiceData.total
        )}</p>
        ${
          invoiceData.salesTax
            ? `<p class="text-xs text-gray-500 mt-2">${SALES_TAX_NOTE}</p>`
            : ""
        }
      </div>
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
      logoUrl: INVOICE_CONFIG.LOGO_URL,
      formattedDate,
      title: "Invoice",
      bodyContent: orderInoviceBody(invoiceData),
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
    console.error("Order Inovice generation error:", err.message);
    throw err;
  }
};

module.exports = { orderInovice };
