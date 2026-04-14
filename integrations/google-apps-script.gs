function doPost(e) {
  try {
    const SPREADSHEET_ID = "1QuJBbVdmvGnhl4wzeOoxVD5jFAoewBJmIVQKVzWN7u8";
    const SALES_SHEET_NAME = "Sales";
    const PURCHASE_SHEET_NAME = "Purchase";

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (error) {
        payload = {};
      }
    }

    const type = payload.type === "purchase" ? "purchase" : "sale";

    if (type === "purchase") {
      const purchaseSheet = ss.getSheetByName(PURCHASE_SHEET_NAME) || ss.insertSheet(PURCHASE_SHEET_NAME);
      ensurePurchaseHeaders(purchaseSheet);

      const date = payload.date || "";
      const source = payload.source || "";
      const purchaseKg = Number(payload.purchaseKg || 0);
      const purchaseRate = Number(payload.purchaseRate || 0);
      const purchaseTotal = Number(payload.purchaseTotal || purchaseKg * purchaseRate);
      const transportFare = Number(payload.transportFare || 0);
      const grandTotal = Number(payload.grandTotal || purchaseTotal + transportFare);
      const quantityLabel = payload.quantityLabel || "";

      if (!date || purchaseKg <= 0 || purchaseRate <= 0) {
        return jsonResponse({ ok: false, message: "Missing required purchase fields" });
      }

      purchaseSheet.appendRow([
        date,
        source,
        purchaseKg,
        purchaseRate,
        purchaseTotal,
        transportFare,
        grandTotal,
        quantityLabel,
        new Date()
      ]);

      return jsonResponse({ ok: true, message: "Purchase row added" });
    }

    const salesSheet = ss.getSheetByName(SALES_SHEET_NAME) || ss.insertSheet(SALES_SHEET_NAME);
    ensureSaleHeaders(salesSheet);

    const date = payload.date || "";
    const name = payload.name || "";
    const village = payload.village || "";
    const customerNumber = payload.customerNumber || "";
    const kgDecimal = Number(payload.kg || 0);
    const rate = Number(payload.rate || 230);
    const total = Number(payload.total || kgDecimal * rate);
    const paymentMode = payload.paymentMode || "";

    // Optional values from website payload
    const quantityLabel = payload.quantityLabel || "";

    if (!date || !name || kgDecimal <= 0 || !paymentMode) {
      return jsonResponse({ ok: false, message: "Missing required fields" });
    }

    salesSheet.appendRow([
      date,
      name,
      village,
      customerNumber,
      kgDecimal,
      rate,
      total,
      paymentMode,
      quantityLabel,
      new Date()
    ]);

    return jsonResponse({ ok: true, message: "Row added" });
  } catch (error) {
    return jsonResponse({ ok: false, message: String(error) });
  }
}

function ensureSaleHeaders(sheet) {
  const headers = [
    "Date",
    "Name",
    "Village",
    "Customer Number",
    "KG (Decimal)",
    "Rate",
    "Total",
    "Payment Mode",
    "Quantity Label",
    "Created At"
  ];

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isEmpty = firstRow.every(function (cell) {
    return !cell;
  });

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function ensurePurchaseHeaders(sheet) {
  const headers = [
    "Date",
    "Source",
    "Purchase KG",
    "Purchase Rate",
    "Purchase Total",
    "Transport Fare",
    "Grand Total",
    "Quantity Label",
    "Created At"
  ];

  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  const isEmpty = firstRow.every(function (cell) {
    return !cell;
  });

  if (isEmpty) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
