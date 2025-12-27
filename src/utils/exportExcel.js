const ExcelJS = require('exceljs');

const exportToExcelBuffer = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Responses');

  if (!rows || rows.length === 0) {
    sheet.addRow(['No data']);
  } else {
    const headers = Object.keys(rows[0]);
    sheet.addRow(headers);

    rows.forEach((r) => {
      sheet.addRow(headers.map(h => r[h]));
    });
  }

  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  exportToExcelBuffer
};
