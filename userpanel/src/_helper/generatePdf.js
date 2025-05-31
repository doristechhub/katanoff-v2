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

    const nameLine = `${x?.productName}\n`; // one line space below name
    const priceLine = `$${helperFunctions.toFixedNumber(x.productPrice)}`;

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
        width: 35,
        height: 35,
        alias: x?.productName,
      },
      `${nameLine}${priceLine}\n${variations}${diamondDetail}`,
      x?.cartQuantity,
      helperFunctions.toFixedNumber(unitPrice),
      helperFunctions.toFixedNumber(x?.unitAmount),
    ];
  });

  autoTable(doc, {
    theme: "grid",
    startY: 190,
    head: headers,
    body: data,
    headStyles: { fillColor: [32, 42, 78] },
    columnStyles: {
      2: { halign: "center", valign: "center" },
      3: { cellWidth: 85, halign: "right", valign: "center" },
      4: { cellWidth: 70, halign: "right", valign: "center" },
    },
    bodyStyles: {
      minCellHeight: 35,
      textColor: "#111111",
    },
    didDrawCell: (data) => {
      if (data?.column?.index === 0 && data?.row?.index >= 0) {
        const img = data?.cell?.raw?.image;
        if (img) {
          const cellWidth = data?.cell?.width;
          const cellHeight = data?.cell?.height;
          const imgWidth = 60;
          const imgHeight = 60;
          const xOffset = data?.cell?.x + (cellWidth - imgWidth) / 2;
          const yOffset = data?.cell?.y + (cellHeight - imgHeight) / 2;
          doc.addImage(
            img,
            "JPEG",
            xOffset,
            yOffset,
            imgWidth,
            imgWidth,
            undefined,
            "FAST"
          );
        }
      }
    },
  });

  const bottomRightX = pageWidth - 150;
  const bottomRightY = doc.lastAutoTable.finalY + 20;

  doc.text(
    `Subtotal: $ ${helperFunctions.toFixedNumber(invoiceData?.subTotal)}`,
    bottomRightX,
    bottomRightY
  );
  doc.text(
    `Taxes: $ ${helperFunctions.toFixedNumber(invoiceData?.salesTax)}`,
    bottomRightX,
    bottomRightY + 15
  );
  doc
    .text(
      `Shipping Charge: $ ${helperFunctions.toFixedNumber(
        invoiceData?.shippingCharge
      )}`,
      bottomRightX,
      bottomRightY + 30
    )
    .setFont(undefined, "bold");
  doc.text(
    `Total Amount: $ ${helperFunctions.toFixedNumber(invoiceData?.total)}`,
    bottomRightX,
    bottomRightY + 50
  );

  doc.save(`${invoiceData?.orderNumber}.pdf`);
};
