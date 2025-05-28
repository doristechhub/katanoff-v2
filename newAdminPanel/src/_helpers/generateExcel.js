import * as XLSX from 'xlsx';


export const generateExcel = async (currentItemsData, sheetName = "sheet1") => {
const fileName = `${sheetName.replace(" ","_")}.xlsx`
  const worksheet = XLSX.utils.json_to_sheet(currentItemsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, fileName);
};
