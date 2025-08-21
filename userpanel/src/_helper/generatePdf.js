import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { helperFunctions } from "./helperFunctions";
import { CARD, SALES_TAX_NOTE } from "./constants";

export const convertImageToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { redirect: "follow" });
    if (!response.ok) {
      // throw new Error(
      //   `Failed to fetch image (${response?.status}): ${response?.statusText}`
      // );
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image to base64:", error);
    throw error;
  }
};

export const generatePDF = async (orderData, sizePage = "1") => {
  const logoBase64 = `data:image/webp;base64,${await convertImageToBase64(
    "/images/logo.webp"
  )}`;

  const invoiceData = {
    ...orderData,
    products: await Promise.all(
      orderData?.products?.map(async (x) => ({
        ...x,
        productImage: `data:image/png;base64,${await convertImageToBase64(
          x?.productImage
        )}`,
      }))
    ),
  };

  const doc = new jsPDF(sizePage, "pt", "a4");
  const date = new Date();
  const formattedDate = `Date: ${date.getMonth() + 1
    } / ${date.getDate()} / ${date.getFullYear()}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const imageSize = 40;
  const minCellHeight = 45;
  const imgTopY = 30;
  const topY = 40;
  const logoWidth = 60;
  const logoHeight = 60;
  const leftColX = 40;
  const rightColX = pageWidth - 210;

  doc.addImage(logoBase64, "WEBP", leftColX, imgTopY, logoWidth, logoHeight);

  doc.setFontSize(20);
  doc.text("Invoice", pageWidth - 145, topY + 15, { align: "right" });
  doc.setFontSize(10);
  doc.text(formattedDate, pageWidth - 125, topY + 35, { align: "right" });

  const sectionTop = topY + logoHeight + 10;

  doc.setFontSize(11);
  doc.setFont(undefined, "bold");
  doc.text("Order Details", leftColX, sectionTop);
  doc.setFont(undefined, "normal");
  doc.text(
    `Order Number: ${invoiceData?.orderNumber}`,
    leftColX,
    sectionTop + 15
  );
  doc.text(
    `Order Date: ${new Date(invoiceData?.createdDate)?.toLocaleDateString()}`,
    leftColX,
    sectionTop + 30
  );
  doc.text(
    `Order Status: ${helperFunctions?.capitalizeCamelCase(
      invoiceData?.orderStatus
    )}`,
    leftColX,
    sectionTop + 45
  );
  doc.text(
    `Payment Status: ${helperFunctions?.capitalizeCamelCase(
      invoiceData?.paymentStatus
    )}`,
    leftColX,
    sectionTop + 60
  );

  doc.setFont(undefined, "bold");
  doc.text("Shipping Address", rightColX, sectionTop);
  doc.setFont(undefined, "normal");
  doc.text(
    `Name: ${invoiceData?.shippingAddress?.name}`,
    rightColX,
    sectionTop + 15
  );
  doc.text(
    `Email: ${invoiceData?.shippingAddress?.email}`,
    rightColX,
    sectionTop + 30,
    { maxWidth: pageWidth / 2 - 120 }
  );
  doc.text(
    `Address: ${invoiceData.shippingAddress.address}, ${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state}, ${invoiceData.shippingAddress.country} - ${invoiceData.shippingAddress.pinCode}`,
    rightColX,
    sectionTop + 45,
    { maxWidth: pageWidth / 2 - 120 }
  );
  doc.text(
    `Mobile: ${invoiceData?.shippingAddress?.mobile}`,
    rightColX,
    sectionTop + 75
  );

  if (invoiceData?.paymentMethodDetails?.type) {
    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    doc.text("Payment Details", leftColX, sectionTop + 90);
    doc.setFont(undefined, "normal");
  }

  if (invoiceData?.paymentMethodDetails?.type) {
    const paymentText =
      invoiceData.paymentMethodDetails.type === CARD
        ? `${invoiceData.paymentMethodDetails.brand} ending in ${invoiceData.paymentMethodDetails.lastFour}`
        : invoiceData.paymentMethodDetails.type;

    doc.text(`Payment Method: ${paymentText}`, leftColX, sectionTop + 105);
  }

  // Billing Address
  const address = invoiceData?.billingAddress;
  if (
    address?.line1 &&
    address?.city &&
    address?.state &&
    address?.country &&
    address?.postal_code
  ) {
    doc.text(
      `Billing Address: ${address?.line1} ${address?.line2}, ${address.city}, ${address?.state}, ${address?.country} - ${address?.postal_code}`,
      leftColX,
      sectionTop + 120,
      { maxWidth: pageWidth / 2 - 120 }
    );
  }

  // Table Headers and Body
  const headers = [["IMAGE", "PRODUCT", "QTY", "UNIT PRICE ($)", "TOTAL ($)"]];
  const data = invoiceData?.products?.map((x) => {
    const variations = x?.variations
      ?.map((y) => `${y?.variationName} : ${y?.variationTypeName}`)
      .join("\n");

    const isDiamond = Boolean(x?.diamondDetail);

    const nameLine = helperFunctions?.formatProductNameWithCarat({
      caratWeight: x?.diamondDetail ? x?.diamondDetail?.caratWeight : x?.totalCaratWeight,
      productName: x?.productName,
    });

    const diamondDetail = isDiamond
      ? `\n\nDiamond Details:\n` +
      `- Carat: ${x?.diamondDetail?.caratWeight}\n` +
      `- Clarity: ${x?.diamondDetail?.clarity}\n` +
      `- Color: ${x?.diamondDetail?.color}\n` +
      `- Shape: ${x?.diamondDetail?.shapeName}`
      : "";

    const unitPrice = x.productPrice;

    return [
      {
        content: "",
        image: x?.productImage,
        width: 20,
        height: 20,
        alias: x?.productName,
      },
      `${nameLine}\n${variations}${diamondDetail}`,
      x?.cartQuantity,
      helperFunctions?.formatCurrency(unitPrice),
      helperFunctions?.formatCurrency(x?.unitAmount),
    ];
  });

  autoTable(doc, {
    theme: "grid",
    startY: 280,
    head: [["IMAGE", "PRODUCT", "QTY", "UNIT PRICE ($)", "TOTAL ($)"]],
    body: data,
    headStyles: { fillColor: [32, 42, 78] },
    columnStyles: {
      0: { cellWidth: 50, halign: "center", valign: "middle" },
      1: { cellWidth: 230 },
      2: { halign: "center" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
    bodyStyles: {
      minCellHeight: minCellHeight,
      textColor: "#111111",
      valign: "middle",
    },
    didDrawCell: (data) => {
      if (data.column.index === 0 && data.cell.raw?.image) {
        const img = data.cell.raw.image;
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellWidth = data.cell.width;
        const cellHeight = data.cell.height;

        const xOffset = cellX + (cellWidth - imageSize) / 2;
        const yOffset = cellY + (cellHeight - imageSize) / 2;

        doc.addImage(img, "JPEG", xOffset, yOffset, imageSize, imageSize);
      }
    },
  });

  // Align with the right edge of the table (same as page right margin)
  const bottomRightX = pageWidth - 40;
  let currentY = doc.lastAutoTable.finalY + 20;

  // Subtotal
  doc.text(
    `Subtotal: ${helperFunctions?.formatCurrencyWithDollar(
      invoiceData?.subTotal
    )}`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 15;

  // Promo Discount (if any)
  if (invoiceData?.discount > 0) {
    doc.text(
      `Promo Discount: -${helperFunctions?.formatCurrencyWithDollar(
        invoiceData?.discount
      )}`,
      bottomRightX,
      currentY,
      { align: "right" }
    );
    currentY += 15;
  }

  doc.text(
    `Sales Tax ${invoiceData?.salesTaxPercentage
      ? `(${invoiceData?.salesTaxPercentage}%)`
      : ""
    }: ${invoiceData?.salesTax && Number(invoiceData?.salesTax) !== 0
      ? `${helperFunctions?.formatCurrencyWithDollar(invoiceData?.salesTax)}`
      : "$0.00"
    }`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 15;

  // Shipping Charge
  doc.text(
    `Shipping Fees: ${Number(invoiceData?.shippingCharge) > 0
      ? helperFunctions?.formatCurrencyWithDollar(invoiceData?.shippingCharge)
      : "Free"
    }`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 15;

  // Horizontal line before Total Amount
  doc.setDrawColor(200); // light gray line (like hr)
  doc.line(bottomRightX - 120, currentY, pageWidth - 40, currentY);
  currentY += 15;

  // Total Amount (bold)
  doc
    .setFont(undefined, "bold")
    .text(
      `Total Amount: ${helperFunctions?.formatCurrencyWithDollar(
        invoiceData?.total
      )}`,
      bottomRightX,
      currentY,
      { align: "right" }
    );
  currentY += 25;

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);

  doc.text(SALES_TAX_NOTE, 40, currentY, { maxWidth: pageWidth - 80 });

  doc.save(`${invoiceData?.orderNumber}.pdf`);
  return true;
};
