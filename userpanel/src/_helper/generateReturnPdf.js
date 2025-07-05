import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { helperFunctions } from "./helperFunctions";
import { ESTIMATE_AMOUNT_NOTE } from "./constants";

export const convertImageToBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { redirect: "follow" });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image (${response?.status}): ${response?.statusText}`
      );
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

export const generateReturnPDF = async (returnData, sizePage = "1") => {
  const invoiceData = {
    ...returnData,
    products: await Promise.all(
      returnData?.products?.map(async (x) => ({
        ...x,
        productImage: `data:image/png;base64,${await convertImageToBase64(
          x?.productImage
        )}`,
      }))
    ),
  };

  const doc = new jsPDF(sizePage, "pt", "a4");
  const date = new Date();
  const formattedDate = `Date: ${
    date.getMonth() + 1
  } / ${date.getDate()} / ${date.getFullYear()}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const topHeight = 25;
  const imageSize = 40;
  const minCellHeight = 45;

  // Title and Order Info
  doc.setFontSize(20);
  doc.text("Return Invoice", pageWidth - 150, topHeight);
  doc.setFontSize(10);
  doc
    .text(formattedDate, pageWidth - 150, topHeight + 15)
    .setFont(undefined, "bold");

  doc.text("Return Details", 40, topHeight).setFont(undefined, "normal");
  doc.text(`Order Number: ${invoiceData?.orderNumber}`, 40, topHeight + 15);
  doc.text(
    `Return Request Date: ${new Date(
      invoiceData?.createdDate
    )?.toLocaleDateString()}`,
    40,
    topHeight + 30
  );
  doc.text(
    `Return Status: ${helperFunctions?.capitalizeCamelCase(
      invoiceData?.status
    )}`,
    40,
    topHeight + 45
  );
  doc
    .text(
      `Return Payment Status: ${helperFunctions?.capitalizeCamelCase(
        invoiceData?.returnPaymentStatus
      )}`,
      40,
      topHeight + 60
    )
    .setFont(undefined, "bold");

  // Shipping Info
  doc.text("Shipping Address", 40, topHeight + 80).setFont(undefined, "normal");
  doc.text(`Name: ${invoiceData?.shippingAddress?.name}`, 40, topHeight + 95);
  doc.text(
    `Email: ${invoiceData?.shippingAddress?.email}`,
    40,
    topHeight + 110
  );
  doc.text(
    `Address: ${invoiceData.shippingAddress.address}, ${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state}, ${invoiceData.shippingAddress.country} - ${invoiceData.shippingAddress.pinCode}`,
    40,
    topHeight + 125
  );
  doc.text(
    `Mobile: ${invoiceData?.shippingAddress?.mobile}`,
    40,
    topHeight + 140
  );

  // Table Headers and Body
  const headers = [["IMAGE", "PRODUCT", "QTY", "UNIT PRICE ($)", "TOTAL ($)"]];
  const data = invoiceData?.products?.map((x) => {
    const variations = x?.variations
      ?.map((y) => `* ${y?.variationName} : ${y?.variationTypeName}`)
      .join("\n");

    const isDiamond = Boolean(x?.diamondDetail);

    const nameLine = `${x?.productName}`;
    const diamondDetail = isDiamond
      ? `\n\nDiamond Details:\n` +
        `- Carat: ${x.diamondDetail.caratWeight}\n` +
        `- Clarity: ${x.diamondDetail.clarity}\n` +
        `- Color: ${x.diamondDetail.color}\n` +
        `- Shape: ${x.diamondDetail.shapeName}`
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
      x?.returnQuantity,
      helperFunctions?.formatCurrency(unitPrice),
      helperFunctions?.formatCurrency(x?.unitAmount),
    ];
  });

  autoTable(doc, {
    theme: "grid",
    startY: 190,
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
    `Sub Total: ${helperFunctions?.formatCurrencyWithDollar(
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
      `Promo Discount: ${helperFunctions?.formatCurrencyWithDollar(
        invoiceData?.discount
      )}`,
      bottomRightX,
      currentY,
      { align: "right" }
    );
    currentY += 15;
  }

  // Taxes
  doc.text(
    `Sales Tax: ${
      invoiceData?.salesTax && Number(invoiceData?.salesTax) !== 0
        ? `${helperFunctions?.formatCurrencyWithDollar(invoiceData?.salesTax)}`
        : "N/A"
    }`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 15;

  // Shipping Charge
  doc.text(
    `Shipping Fees: ${
      helperFunctions.toFixedNumber(invoiceData?.shippingCharge) > 0
        ? helperFunctions?.formatCurrencyWithDollar(invoiceData?.shippingCharge)
        : "Free"
    }`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 10;

  doc.setDrawColor(200); // light gray line (like hr)
  doc.line(bottomRightX - 120, currentY, pageWidth - 40, currentY);
  currentY += 15;

  // Estimated Amount
  doc.text(
    `Estimated Amount: ${
      helperFunctions.toFixedNumber(invoiceData?.returnRequestAmount) > 0
        ? helperFunctions?.formatCurrencyWithDollar(
            invoiceData?.returnRequestAmount
          )
        : "$0.00"
    }`,
    bottomRightX,
    currentY,
    { align: "right" }
  );
  currentY += 15;

  // Deducted Amount
  if (invoiceData?.refundAmount > 0) {
    doc.setFont(undefined, "normal");
    doc.text(
      `Deducted Amount: ${
        helperFunctions.toFixedNumber(invoiceData?.returnRequestAmount) > 0
          ? helperFunctions?.formatCurrencyWithDollar(
              Number(invoiceData?.returnRequestAmount) -
                Number(invoiceData?.refundAmount)
            )
          : "$0.00"
      }`,
      bottomRightX,
      currentY,
      { align: "right" }
    );
    currentY += 15;
  }

  if (invoiceData?.refundAmount > 0) {
    doc.setFont(undefined, "bold");
    doc.text(
      `Refunded Amount: ${helperFunctions?.formatCurrencyWithDollar(
        invoiceData?.refundAmount
      )}`,
      bottomRightX,
      currentY,
      { align: "right" }
    );
  }
  currentY += 25;

  doc.setFont(undefined, "normal");
  doc.setFontSize(9);

  doc.text(ESTIMATE_AMOUNT_NOTE, 40, currentY, { maxWidth: pageWidth - 80 });

  doc.save(`${invoiceData?.orderNumber}.pdf`);
};
