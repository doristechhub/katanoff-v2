import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { helperFunctions } from "./helperFunctions";

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

export const generatePDF = async (orderData, sizePage = "1") => {
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
  const formattedDate = `Date: ${
    date.getMonth() + 1
  } / ${date.getDate()} / ${date.getFullYear()}`;
  const pageWidth = doc.internal.pageSize.getWidth();
  const topHeight = 25;
  const imageSize = 40; // Adjust as needed
  const minCellHeight = 45; // Match or exceed image size

  // Title and Order Info
  doc.setFontSize(20);
  doc.text("Invoice", pageWidth - 150, topHeight);
  doc.setFontSize(10);
  doc
    .text(formattedDate, pageWidth - 150, topHeight + 15)
    .setFont(undefined, "bold");

  doc.text("Order Details", 40, topHeight).setFont(undefined, "normal");
  doc.text(`Order Number: ${invoiceData?.orderNumber}`, 40, topHeight + 15);
  doc.text(
    `Order Date: ${new Date(invoiceData?.createdDate)?.toLocaleDateString()}`,
    40,
    topHeight + 30
  );
  doc.text(`Order Status: ${invoiceData?.orderStatus}`, 40, topHeight + 45);
  doc
    .text(`Payment Status: ${invoiceData?.paymentStatus}`, 40, topHeight + 60)
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

    const nameLine = `${x?.productName}`; // one line space below name
    // const priceLine = `$${helperFunctions.toFixedNumber(x.productPrice)}`;

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
      x?.cartQuantity,
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
      0: { cellWidth: 50, halign: "center", valign: "middle" }, // image
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

  const bottomRightX = pageWidth - 160;
  let currentY = doc.lastAutoTable.finalY + 20;

  // Subtotal
  doc.text(
    `Subtotal: $${helperFunctions?.formatCurrency(
      helperFunctions?.getDisplaySubtotalWithDiscount(
        invoiceData?.subTotal,
        invoiceData?.discount
      )
    )}`,
    bottomRightX,
    currentY
  );
  currentY += 15;

  // Promo Discount (if any)
  if (invoiceData?.discount > 0) {
    doc.text(
      `Promo Discount: $${helperFunctions?.formatCurrency(
        helperFunctions.toFixedNumber(invoiceData?.discount)
      )}`,
      bottomRightX,
      currentY
    );
    currentY += 15;
  }

  // Taxes
  doc.text(
    `Taxes: ${
      invoiceData?.salesTax && Number(invoiceData?.salesTax) !== 0
        ? `$${helperFunctions?.formatCurrency(
            helperFunctions.toFixedNumber(invoiceData?.salesTax)
          )}`
        : "N/A"
    }`,
    bottomRightX,
    currentY
  );

  currentY += 15;

  // Shipping Charge
  doc.text(
    `Shipping Fees:  ${
      helperFunctions.toFixedNumber(invoiceData?.shippingCharge) > 0
        ? "$" +
          helperFunctions?.formatCurrency(
            helperFunctions.toFixedNumber(invoiceData?.shippingCharge)
          )
        : "Free"
    }`,
    bottomRightX,
    currentY
  );
  currentY += 15;

  // Total Amount (bold)
  doc
    .setFont(undefined, "bold")
    .text(
      `Total Amount: $${helperFunctions?.formatCurrency(
        helperFunctions.toFixedNumber(invoiceData?.total)
      )}`,
      bottomRightX,
      currentY
    );

  doc.save(`${invoiceData?.orderNumber}.pdf`);
};
