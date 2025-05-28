import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

export const generateTopSellingPDF = async (topSellingData, sizePage = "1") => {
  let printableData = { ...topSellingData };

  printableData = {
    ...printableData,
    productsList: await Promise.all(
      printableData?.list?.map(async (x) => ({
        ...x,
        productImage: `data:image/png;base64,${await convertImageToBase64(
          x?.productImage
        )}`,
      }))
    ),
  };

  const doc = new jsPDF(sizePage, "pt", "a4");

  const pageWidth = doc.internal.pageSize.width;
  const topHeight = 25;

  // Title
  doc.setFontSize(20);
  doc.text("Top Selling Products List", pageWidth - 420, topHeight);
  doc.setFontSize(10).setFont(undefined, "bold");

  // params Detail
  doc.text("Configuration Details", 40, topHeight + 20).setFont(undefined, "normal");

  doc.text(`Limit: ${printableData?.limit || 'All'}`, 40, topHeight + 35);
  doc.text(
    `Start Date: ${new Date(printableData?.dateRange?.startDate)?.toLocaleDateString()}`,
    40,
    topHeight + 50
  );
  doc.text(`End Date: ${new Date(printableData?.dateRange?.endDate)?.toLocaleDateString()}`, 40, topHeight + 65);
  if(printableData?.priceRange?.minPrice && printableData?.priceRange?.maxPrice){
    doc.text(`Min Price: ${printableData?.priceRange?.minPrice}`, 40, topHeight + 80);
    doc.text(`Max Price: ${printableData?.priceRange?.maxPrice}`, 40, topHeight + 95);
  }
  
  const headers = [["IMAGE", "PRODUCT","SKU", "SOLD QTY", "TOTAL SALES ($)"]];
  const data = printableData?.productsList?.map((x) => {
    const variations = x?.variations
      ?.map((y) => `* ${y?.variationName} : ${y?.variationTypeName}`)
      .join("\n");
    return [
      {
        content: "",
        image: x?.productImage,
        width: 35,
        height: 35,
        alias: x?.productName,
      },
      `${x?.productName}\n\n${variations}`,
      x?.sku,
      x?.soldQuantity,
      x?.totalSalesAmount,
    ];
  });

  let content = {
    theme: "grid",
    startY: 130,
    head: headers,
    body: data,
    headStyles: {
      fillColor: [72, 126, 176], // Header background color
      textColor: [255, 255, 255], // Header text color
      fontStyle: "bold",
      halign: "center", // Center aligning header text
    },
    columnStyles: {
      2: { halign: "center", valign: "center" },
      3: { cellWidth: 85, halign: "right", valign: "center" },
      4: { cellWidth: 70, halign: "right", valign: "center" },
    },
    didDrawCell: async (data) => {
      if (data?.column?.index === 0 && data?.row?.index >= 0) {
        const img = data?.cell?.raw?.image;
        if (img) {
          const cellWidth = data?.cell?.width;
          const cellHeight = data?.cell?.height;
          const imgWidth = 30;
          const imgHeight = 33;
          // Set Image to center
          const xOffset = data?.cell?.x + (cellWidth - imgWidth) / 2;
          const yOffset = data?.cell?.y + (cellHeight - imgHeight) / 2;
          //   doc.addImage(img, xOffset, yOffset, imgWidth, imgWidth);
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
    bodyStyles: {
      minCellHeight: 35, // Set the fixed height for each row
    },
  };

  doc.autoTable(content);

  doc.save(`${'Top Selling Product'}.pdf`);
};
