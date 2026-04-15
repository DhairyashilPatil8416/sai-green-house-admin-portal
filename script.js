const PRICE_PER_KG = 230;
const STORAGE_KEY = "sai_green_house_sales_v2";
const GOOGLE_SCRIPT_URL_KEY = "sai_google_script_url";
const SHOP_NAME = "Sai GreenHouse Paper Harali";
const SHOP_ADDRESS = "Harali.BK Tal-Gadhinglaj";
const SHOP_CONTACT = "7776926296";
const SHOP_EMAIL_GST = "Email/GST: N/A";

// LOGIN CONSTANTS
const LOGIN_SESSION_KEY = "sai_admin_logged_in";
const DEFAULT_USERNAME = "Saigreenhouse";
const DEFAULT_PASSWORD = "Saigreenhouse@2021";

// LOGIN DOM ELEMENTS
const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");
const loginForm = document.getElementById("loginForm");
const loginUsernameInput = document.getElementById("loginUsername");
const loginPasswordInput = document.getElementById("loginPassword");
const passwordToggle = document.getElementById("passwordToggle");
const logoutBtn = document.getElementById("logoutBtn");

// LOGIN FUNCTIONS
function initializeLogin() {
  // Check if user is already logged in
  if (isUserLoggedIn()) {
    showDashboard();
  } else {
    showLoginScreen();
  }

  // Setup event listeners
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (passwordToggle) {
    passwordToggle.addEventListener("click", togglePasswordVisibility);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
}

function isUserLoggedIn() {
  return sessionStorage.getItem(LOGIN_SESSION_KEY) === "true";
}

function handleLogin(e) {
  e.preventDefault();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
    sessionStorage.setItem(LOGIN_SESSION_KEY, "true");
    loginForm.reset();
    showDashboard();
  } else {
    window.alert("Invalid username or password.");
    loginPasswordInput.value = "";
    loginPasswordInput.focus();
  }
}

function handleLogout() {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (confirmLogout) {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    loginPasswordInput.value = "";
    loginUsernameInput.value = "";
    showLoginScreen();
  }
}

function togglePasswordVisibility() {
  const isPassword = loginPasswordInput.type === "password";
  loginPasswordInput.type = isPassword ? "text" : "password";
  passwordToggle.textContent = isPassword ? "🙈" : "👁";
}

function showLoginScreen() {
  if (loginScreen) loginScreen.classList.remove("hidden");
  if (dashboardScreen) dashboardScreen.classList.add("hidden");
}

function showDashboard() {
  if (loginScreen) loginScreen.classList.add("hidden");
  if (dashboardScreen) dashboardScreen.classList.remove("hidden");
  initializeDashboard();
}

// Initialize login on page load
document.addEventListener("DOMContentLoaded", initializeLogin);

const saleForm = document.getElementById("saleForm");
const editingSaleIdInput = document.getElementById("editingSaleId");
const customerNameInput = document.getElementById("customerName");
const customerVillageInput = document.getElementById("customerVillage");
const customerNumberInput = document.getElementById("customerNumber");
const quantityKgInput = document.getElementById("quantityKg");
const quantityGramInput = document.getElementById("quantityGram");
const saleDateInput = document.getElementById("saleDate");
const paymentModeInput = document.getElementById("paymentMode");
const billSendModeInput = document.getElementById("billSendMode");
const customerSearchInput = document.getElementById("customerSearch");
const liveTotalEl = document.getElementById("liveTotal");
const purchaseRateInput = document.getElementById("purchaseRate");
const purchaseSourceInput = document.getElementById("purchaseSource");
const transportFareInput = document.getElementById("transportFare");
const exportPurchasePdfBtn = document.getElementById("exportPurchasePdfBtn");
const savePurchaseToSheetBtn = document.getElementById("savePurchaseToSheetBtn");
const clearPurchaseDataBtn = document.getElementById("clearPurchaseDataBtn");
const saveSaleBtn = document.getElementById("saveSaleBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const todayTotalAmountEl = document.getElementById("todayTotalAmount");
const todayTotalKgEl = document.getElementById("todayTotalKg");
const todayOnlineAmountEl = document.getElementById("todayOnlineAmount");
const todayCashAmountEl = document.getElementById("todayCashAmount");

const monthlyTotalAmountEl = document.getElementById("monthlyTotalAmount");
const monthlyTotalKgEl = document.getElementById("monthlyTotalKg");
const monthlyOnlineAmountEl = document.getElementById("monthlyOnlineAmount");
const monthlyCashAmountEl = document.getElementById("monthlyCashAmount");

const totalEntriesEl = document.getElementById("totalEntries");

const todayAmountInlineEl = document.getElementById("todayAmountInline");
const todayKgInlineEl = document.getElementById("todayKgInline");
const todayOnlineInlineEl = document.getElementById("todayOnlineInline");
const todayCashInlineEl = document.getElementById("todayCashInline");

const monthAmountInlineEl = document.getElementById("monthAmountInline");
const monthKgInlineEl = document.getElementById("monthKgInline");
const monthOnlineInlineEl = document.getElementById("monthOnlineInline");
const monthCashInlineEl = document.getElementById("monthCashInline");

const todaySalesBody = document.getElementById("todaySalesBody");
const monthlySalesBody = document.getElementById("monthlySalesBody");
const dailySummaryBody = document.getElementById("dailySummaryBody");
const customerReportBody = document.getElementById("customerReportBody");

const exportTodayExcelBtn = document.getElementById("exportTodayExcelBtn");
const exportTodayPdfBtn = document.getElementById("exportTodayPdfBtn");
const exportMonthlyExcelBtn = document.getElementById("exportMonthlyExcelBtn");
const exportMonthlyPdfBtn = document.getElementById("exportMonthlyPdfBtn");
const exportDailyExcelBtn = document.getElementById("exportDailyExcelBtn");
const exportDailyPdfBtn = document.getElementById("exportDailyPdfBtn");

const googleScriptUrlInput = document.getElementById("googleScriptUrl");
const saveGoogleScriptBtn = document.getElementById("saveGoogleScriptBtn");
const syncAllToSheetBtn = document.getElementById("syncAllToSheetBtn");
const syncStatusText = document.getElementById("syncStatusText");

const clearDataBtn = document.getElementById("clearDataBtn");
const installAppBtn = document.getElementById("installAppBtn");
const yearEl = document.getElementById("year");
const quickNavLinks = Array.from(document.querySelectorAll(".quick-nav-link"));

let todaySalesCache = [];
let monthlySalesCache = [];
let deferredInstallPrompt = null;
let quickNavInitialized = false;

function formatINR(amount) {
  return `Rs ${Number(amount).toLocaleString("en-IN")}`;
}

function parseISODate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function getQuantityValues() {
  const kg = Math.max(0, Number(quantityKgInput.value) || 0);
  const gramRaw = Math.max(0, Number(quantityGramInput.value) || 0);
  const gram = Math.min(999, Math.floor(gramRaw));
  return { kg: Math.floor(kg), gram };
}

function toTotalKg(quantityKg, quantityGram) {
  return quantityKg + quantityGram / 1000;
}

function splitKgToKgGram(quantityKg) {
  const totalGrams = Math.round((Number(quantityKg) || 0) * 1000);
  const kg = Math.floor(totalGrams / 1000);
  const gram = totalGrams % 1000;
  return { kg, gram };
}

function formatKgGram(quantityKg) {
  const parts = splitKgToKgGram(quantityKg);
  return `${parts.kg} KG ${parts.gram} G`;
}

function getTodayISODate() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function formatDateTime(dateInput = new Date()) {
  const dateObj = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return dateObj.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function generateBillNumber(prefix, seedValue) {
  const seed = String(seedValue || Date.now()).replace(/[^a-zA-Z0-9]/g, "").slice(-8);
  return `${prefix}-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${seed}`;
}

function getFileStamp() {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${yyyy}${mm}${dd}-${hh}${mi}${ss}`;
}

function sanitizePhoneNumber(rawNumber) {
  const digits = String(rawNumber || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

function buildSaleBillMessage(sale) {
  const saleBillNo = generateBillNumber("SALE", sale.id || sale.createdAt || Date.now());
  const saleDateTime = formatDateTime(sale.createdAt || new Date());

  return [
    `*${SHOP_NAME}*`,
    "",
    `Address: ${SHOP_ADDRESS}`,
    `Contact Number: ${SHOP_CONTACT}`,
    `${SHOP_EMAIL_GST.replace("/", " ")}`,
    `Bill Number: ${saleBillNo}`,
    `Date Time: ${saleDateTime}`,
    "------------------------------",
    `Customer: ${sale.customerName}`,
    `Village: ${sale.customerVillage || "-"}`,
    `Mobile: ${sale.customerNumber || "-"}`,
    `Sale Date: ${sale.saleDate}`,
    `Quantity: ${formatKgGram(sale.quantityKg)}`,
    `Rate: Rs ${sale.rate} / KG`,
    `Payment Mode: ${sale.paymentMode}`,
    `Paid Amount: ${formatINR(sale.total)}`,
    "------------------------------",
    "Thank you."
  ].join("\n");
}

async function openWhatsAppBill(sale) {
  const phone = sanitizePhoneNumber(sale.customerNumber);
  if (!phone) {
    window.alert("Customer mobile number is missing.");
    return;
  }
  const plainMessage = buildSaleBillMessage(sale);
  await copyTextToClipboard(plainMessage);
  const message = encodeURIComponent(plainMessage);
  const universalUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
  const popup = window.open(universalUrl, "_blank");

  if (!popup) {
    // Fallback when popup is blocked by browser.
    window.location.href = universalUrl;
  }

  window.alert("Bill message copy झाला आहे. WhatsApp मध्ये paste करून send करा.");
}

async function openSmsBill(sale) {
  const phone = sanitizePhoneNumber(sale.customerNumber);
  if (!phone) {
    window.alert("Customer mobile number is missing.");
    return;
  }
  const plainMessage = buildSaleBillMessage(sale);
  await copyTextToClipboard(plainMessage);
  const message = encodeURIComponent(plainMessage);
  window.open(`sms:${phone}?body=${message}`, "_blank");
  window.alert("Bill message copy झाला आहे. SMS app मध्ये paste करून send करा.");
}

function sendBillByMode(sale, mode) {
  if (!sale || mode === "none") {
    return;
  }
  if (mode === "whatsapp") {
    openWhatsAppBill(sale);
    return;
  }
  if (mode === "sms") {
    openSmsBill(sale);
    return;
  }
  if (mode === "both") {
    openWhatsAppBill(sale);
    openSmsBill(sale);
  }
}

function getGoogleScriptUrl() {
  return localStorage.getItem(GOOGLE_SCRIPT_URL_KEY) || "";
}

function updateSyncStatus() {
  const url = getGoogleScriptUrl();
  syncStatusText.textContent = url ? "Sheet sync: On" : "Sheet sync: Off";
}

function saveGoogleScriptUrl() {
  const value = googleScriptUrlInput.value.trim();
  if (!value) {
    localStorage.removeItem(GOOGLE_SCRIPT_URL_KEY);
    updateSyncStatus();
    window.alert("Google Sheet sync URL removed.");
    return;
  }

  localStorage.setItem(GOOGLE_SCRIPT_URL_KEY, value);
  updateSyncStatus();
  window.alert("Google Sheet sync URL saved.");
}

function normalizeSales(rawSales) {
  if (!Array.isArray(rawSales)) {
    return [];
  }

  return rawSales
    .filter((sale) => sale && sale.customerName && sale.saleDate)
    .map((sale) => {
      const quantityKg = Number(sale.quantityKg) || 0;
      const qtyParts = splitKgToKgGram(quantityKg);
      const paymentMode = sale.paymentMode === "Cash" ? "Cash" : "Online";
      return {
        id: sale.id || crypto.randomUUID(),
        customerName: String(sale.customerName).trim(),
        customerVillage: String(sale.customerVillage || "").trim(),
        customerNumber: String(sale.customerNumber || "").trim(),
        quantityKg,
        quantityGram: qtyParts.gram,
        saleDate: sale.saleDate,
        rate: PRICE_PER_KG,
        total: quantityKg * PRICE_PER_KG,
        paymentMode,
        createdAt: sale.createdAt || new Date().toISOString()
      };
    })
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate));
}

function loadSales() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return normalizeSales(parsed);
  } catch {
    return [];
  }
}

function saveSales(sales) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sales));
}

function updateLiveTotal() {
  const quantity = getQuantityValues();
  const totalKg = toTotalKg(quantity.kg, quantity.gram);
  liveTotalEl.textContent = formatINR(totalKg * PRICE_PER_KG);
}

function updatePurchaseTotal() {
  // Display elements were removed - no totals to update
  return;
}

function getPurchaseSnapshot() {
  const purchaseRate = Math.max(0, Number(purchaseRateInput?.value) || 0);
  const transportFare = Math.max(0, Number(transportFareInput?.value) || 0);
  const source = (purchaseSourceInput?.value || "").trim();

  return {
    purchaseRate,
    transportFare,
    source,
    purchaseDate: getTodayISODate()
  };
}

function resetPurchaseFields() {
  if (purchaseRateInput) {
    purchaseRateInput.value = "";
  }
  if (purchaseSourceInput) {
    purchaseSourceInput.value = "";
  }
  if (transportFareInput) {
    transportFareInput.value = "";
  }
}

async function exportPurchaseToPdf() {
  const data = getPurchaseSnapshot();
  if (data.purchaseKg <= 0 || data.purchaseRate <= 0) {
    window.alert("Purchase KG आणि Rate टाका.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const purchaseBillNo = generateBillNumber("PUR", `${data.purchaseDate}-${data.source}-${data.purchaseKg}`);
  const printedOn = formatDateTime(new Date());

  doc.setFontSize(16);
  doc.text(SHOP_NAME, 105, 16, { align: "center" });
  doc.setFontSize(11);
  doc.text(`Address: ${SHOP_ADDRESS}`, 105, 23, { align: "center" });
  doc.text(`Contact Number: ${SHOP_CONTACT}`, 105, 29, { align: "center" });
  doc.text(`${SHOP_EMAIL_GST.replace("/", " ")}`, 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text("Paper Purchase Bill", 14, 45);
  doc.setFontSize(10.5);
  doc.text(`Bill Number: ${purchaseBillNo}`, 14, 52);
  doc.text(`Date Time: ${printedOn}`, 14, 58);
  doc.text(`Purchase Date: ${data.purchaseDate}`, 14, 64);
  doc.text(`Source: ${data.source || "-"}`, 14, 70);

  doc.autoTable({
    startY: 76,
    head: [["Particular", "Value"]],
    body: [
      ["Purchase Qty (KG)", String(data.purchaseKg)],
      ["Purchase Rate (Rs/KG)", formatINR(data.purchaseRate)],
      ["Purchase Total", formatINR(data.purchaseTotal)],
      ["Transport Fare", formatINR(data.transportFare)],
      ["Final Total (Purchase + Fare)", formatINR(data.grandTotal)]
    ]
  });

  const pdfBlob = doc.output("blob");
  await downloadBlobFile(`sai-purchase-bill-${getFileStamp()}.pdf`, pdfBlob, "application/pdf");
}

function summarizeSales(sales) {
  return sales.reduce(
    (acc, sale) => {
      acc.quantityKg += sale.quantityKg;
      acc.total += sale.total;
      if (sale.paymentMode === "Cash") {
        acc.cash += sale.total;
      } else {
        acc.online += sale.total;
      }
      return acc;
    },
    { quantityKg: 0, total: 0, online: 0, cash: 0 }
  );
}

function renderTableRows(targetBody, rows, emptyMessage, columnsCount) {
  if (rows.length === 0) {
    targetBody.innerHTML = `<tr><td colspan="${columnsCount}">${emptyMessage}</td></tr>`;
    return;
  }

  targetBody.innerHTML = rows.join("");
}

function renderDashboard() {
  const sales = loadSales();
  const todayStr = getTodayISODate();
  const today = parseISODate(todayStr);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const todaySales = sales.filter((sale) => sale.saleDate === todayStr);
  const monthlySales = sales.filter((sale) => {
    const saleDate = parseISODate(sale.saleDate);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  todaySalesCache = todaySales;
  monthlySalesCache = monthlySales;

  const todayTotals = summarizeSales(todaySales);
  const monthlyTotals = summarizeSales(monthlySales);

  todayTotalAmountEl.textContent = formatINR(todayTotals.total);
  todayTotalKgEl.textContent = formatKgGram(todayTotals.quantityKg);
  todayOnlineAmountEl.textContent = `Online: ${formatINR(todayTotals.online)}`;
  todayCashAmountEl.textContent = `Cash: ${formatINR(todayTotals.cash)}`;

  monthlyTotalAmountEl.textContent = formatINR(monthlyTotals.total);
  monthlyTotalKgEl.textContent = formatKgGram(monthlyTotals.quantityKg);
  monthlyOnlineAmountEl.textContent = `Online: ${formatINR(monthlyTotals.online)}`;
  monthlyCashAmountEl.textContent = `Cash: ${formatINR(monthlyTotals.cash)}`;

  totalEntriesEl.textContent = String(sales.length);

  todayAmountInlineEl.textContent = formatINR(todayTotals.total);
  todayKgInlineEl.textContent = formatKgGram(todayTotals.quantityKg);
  todayOnlineInlineEl.textContent = formatINR(todayTotals.online);
  todayCashInlineEl.textContent = formatINR(todayTotals.cash);

  monthAmountInlineEl.textContent = formatINR(monthlyTotals.total);
  monthKgInlineEl.textContent = formatKgGram(monthlyTotals.quantityKg);
  monthOnlineInlineEl.textContent = formatINR(monthlyTotals.online);
  monthCashInlineEl.textContent = formatINR(monthlyTotals.cash);

  const todayRows = todaySales.map(
    (sale) =>
      `<tr>
        <td>${sale.customerName}</td>
        <td>${sale.customerVillage || "-"}</td>
        <td>${sale.customerNumber || "-"}</td>
        <td>${formatKgGram(sale.quantityKg)}</td>
        <td>${sale.paymentMode}</td>
        <td>${formatINR(sale.total)}</td>
        <td>
          <div class="row-actions">
            <button class="action-btn" data-action="edit" data-id="${sale.id}">Edit</button>
            <button class="action-btn delete" data-action="delete" data-id="${sale.id}">Delete</button>
            <button class="action-btn whatsapp" data-action="whatsapp" data-id="${sale.id}">WA</button>
            <button class="action-btn sms" data-action="sms" data-id="${sale.id}">SMS</button>
          </div>
        </td>
      </tr>`
  );

  if (todayRows.length > 0) {
    todayRows.push(
      `<tr class="summary-row"><td><strong>Daily Total Sum</strong></td><td>-</td><td>-</td><td><strong>${formatKgGram(todayTotals.quantityKg)}</strong></td><td>-</td><td><strong>${formatINR(todayTotals.total)}</strong></td><td>-</td></tr>`
    );
  }

  renderTableRows(todaySalesBody, todayRows, "No sale entries for today.", 7);

  const monthlyRows = monthlySales.map(
    (sale) =>
      `<tr>
        <td>${sale.saleDate}</td>
        <td>${sale.customerName}</td>
        <td>${sale.customerVillage || "-"}</td>
        <td>${sale.customerNumber || "-"}</td>
        <td>${formatKgGram(sale.quantityKg)}</td>
        <td>${sale.paymentMode}</td>
        <td>${formatINR(sale.total)}</td>
        <td>
          <div class="row-actions">
            <button class="action-btn" data-action="edit" data-id="${sale.id}">Edit</button>
            <button class="action-btn delete" data-action="delete" data-id="${sale.id}">Delete</button>
            <button class="action-btn whatsapp" data-action="whatsapp" data-id="${sale.id}">WA</button>
            <button class="action-btn sms" data-action="sms" data-id="${sale.id}">SMS</button>
          </div>
        </td>
      </tr>`
  );

  if (monthlyRows.length > 0) {
    monthlyRows.push(
      `<tr class="summary-row"><td><strong>Monthly Total Sum</strong></td><td>-</td><td>-</td><td>-</td><td><strong>${formatKgGram(monthlyTotals.quantityKg)}</strong></td><td>-</td><td><strong>${formatINR(monthlyTotals.total)}</strong></td><td>-</td></tr>`
    );
  }

  renderTableRows(monthlySalesBody, monthlyRows, "No entries found in current month.", 8);

  renderDailySummary(monthlySales);

  renderCustomerReport(sales, customerSearchInput.value.trim());
}

function renderDailySummary(sales) {
  const groupedByDate = new Map();

  sales.forEach((sale) => {
    if (!groupedByDate.has(sale.saleDate)) {
      groupedByDate.set(sale.saleDate, {
        quantityKg: 0,
        online: 0,
        cash: 0,
        total: 0
      });
    }

    const bucket = groupedByDate.get(sale.saleDate);
    bucket.quantityKg += sale.quantityKg;
    bucket.total += sale.total;
    if (sale.paymentMode === "Cash") {
      bucket.cash += sale.total;
    } else {
      bucket.online += sale.total;
    }
  });

  const rows = Array.from(groupedByDate.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, summary]) => {
      return `<tr>
        <td>${date}</td>
        <td>${formatKgGram(summary.quantityKg)}</td>
        <td>${formatINR(summary.online)}</td>
        <td>${formatINR(summary.cash)}</td>
        <td>${formatINR(summary.total)}</td>
      </tr>`;
    });

  const monthlySummary = summarizeSales(sales);
  if (rows.length > 0) {
    rows.push(
      `<tr class="summary-row"><td><strong>All Days Sum</strong></td><td><strong>${formatKgGram(monthlySummary.quantityKg)}</strong></td><td><strong>${formatINR(monthlySummary.online)}</strong></td><td><strong>${formatINR(monthlySummary.cash)}</strong></td><td><strong>${formatINR(monthlySummary.total)}</strong></td></tr>`
    );
  }

  renderTableRows(dailySummaryBody, rows, "No daily totals found in this month.", 5);
}

function resetFormToAddMode() {
  editingSaleIdInput.value = "";
  customerNameInput.value = "";
  customerVillageInput.value = "";
  customerNumberInput.value = "";
  quantityKgInput.value = "1";
  quantityGramInput.value = "0";
  saleDateInput.value = getTodayISODate();
  paymentModeInput.value = "Online";
  saveSaleBtn.textContent = "Save Sale";
  cancelEditBtn.classList.add("hidden");
  updateLiveTotal();
}

function setEditMode(sale) {
  editingSaleIdInput.value = sale.id;
  customerNameInput.value = sale.customerName;
  customerVillageInput.value = sale.customerVillage || "";
  customerNumberInput.value = sale.customerNumber || "";
  const quantityParts = splitKgToKgGram(sale.quantityKg);
  quantityKgInput.value = String(quantityParts.kg);
  quantityGramInput.value = String(quantityParts.gram);
  saleDateInput.value = sale.saleDate;
  paymentModeInput.value = sale.paymentMode;
  saveSaleBtn.textContent = "Update Sale";
  cancelEditBtn.classList.remove("hidden");
  updateLiveTotal();
  customerNameInput.focus();
}

function deleteSale(saleId) {
  const shouldDelete = window.confirm("Delete this sale entry?");
  if (!shouldDelete) {
    return;
  }

  const sales = loadSales().filter((sale) => sale.id !== saleId);
  saveSales(sales);

  if (editingSaleIdInput.value === saleId) {
    resetFormToAddMode();
  }

  renderDashboard();
}

function toCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = String(cell ?? "");
          return `"${value.replaceAll("\"", "\"\"")}"`;
        })
        .join(",")
    )
    .join("\n");
}

function isLikelyMobileDevice() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

async function downloadBlobFile(fileName, blob, mimeType) {
  if (isLikelyMobileDevice() && navigator.canShare && navigator.share && typeof File !== "undefined") {
    try {
      const file = new File([blob], fileName, { type: mimeType });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: fileName,
          text: "Sales report",
          files: [file]
        });
        return;
      }
    } catch {
      // Continue to regular download fallback.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  if (isLikelyMobileDevice()) {
    window.setTimeout(() => {
      window.alert("Download start झाला नसेल तर browser menu मधून Download निवडा.");
    }, 350);
  }
}

async function downloadFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  await downloadBlobFile(fileName, blob, mimeType);
}

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function buildDailyTotalsByDate(sales) {
  const totals = new Map();
  sales.forEach((sale) => {
    const current = totals.get(sale.saleDate) || 0;
    totals.set(sale.saleDate, current + sale.total);
  });
  return totals;
}

function buildDailySummaryData(sales) {
  const groupedByDate = new Map();

  sales.forEach((sale) => {
    if (!groupedByDate.has(sale.saleDate)) {
      groupedByDate.set(sale.saleDate, {
        quantityKg: 0,
        online: 0,
        cash: 0,
        total: 0
      });
    }

    const bucket = groupedByDate.get(sale.saleDate);
    bucket.quantityKg += sale.quantityKg;
    bucket.total += sale.total;
    if (sale.paymentMode === "Cash") {
      bucket.cash += sale.total;
    } else {
      bucket.online += sale.total;
    }
  });

  const rows = Array.from(groupedByDate.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, summary]) => ({
      date,
      quantityKg: summary.quantityKg,
      online: summary.online,
      cash: summary.cash,
      total: summary.total
    }));

  return {
    rows,
    grand: summarizeSales(sales)
  };
}

async function exportSalesToExcel(type) {
  const isToday = type === "today";
  const source = isToday ? todaySalesCache : monthlySalesCache;

  if (!source.length) {
    window.alert(`No ${type} sales available for export.`);
    return;
  }

  const dailyTotals = buildDailyTotalsByDate(source);
  const rows = [["Date", "Name", "Village", "Number", "KG", "Gram", "Rate", "Total", "Payment Mode", "Daily Total"]];
  source.forEach((sale) => {
    const quantity = splitKgToKgGram(sale.quantityKg);
    rows.push([
      sale.saleDate,
      sale.customerName,
      sale.customerVillage || "",
      sale.customerNumber || "",
      quantity.kg,
      quantity.gram,
      sale.rate,
      sale.total,
      sale.paymentMode,
      dailyTotals.get(sale.saleDate) || 0
    ]);
  });

  const csv = toCsv(rows);
  const stamp = getTodayISODate();
  await downloadFile(`sai-${type}-report-${stamp}.csv`, csv, "text/csv;charset=utf-8;");
}

async function exportSalesToPdf(type) {
  const isToday = type === "today";
  const source = isToday ? todaySalesCache : monthlySalesCache;

  if (!source.length) {
    window.alert(`No ${type} sales available for export.`);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const title = isToday ? "Today Sales Report" : "Monthly Sales Report";
  const total = summarizeSales(source);
  const dailyTotals = buildDailyTotalsByDate(source);

  doc.setFontSize(14);
  doc.text("Sai Green House Paper", 14, 16);
  doc.setFontSize(11);
  doc.text(title, 14, 24);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 30);
  doc.text(`Total Qty: ${formatKgGram(total.quantityKg)}`, 14, 36);
  doc.text(`Total Amount: ${formatINR(total.total)}`, 14, 42);
  doc.text(`Online: ${formatINR(total.online)} | Cash: ${formatINR(total.cash)}`, 14, 48);

  doc.autoTable({
    startY: 54,
    head: [["Date", "Name", "Village", "Number", "KG", "Gram", "Rate", "Total", "Payment Mode", "Daily Total"]],
    body: source.map((sale) => {
      const quantity = splitKgToKgGram(sale.quantityKg);
      return [
        sale.saleDate,
        sale.customerName,
        sale.customerVillage || "",
        sale.customerNumber || "",
        quantity.kg,
        quantity.gram,
        sale.rate,
        formatINR(sale.total),
        sale.paymentMode,
        formatINR(dailyTotals.get(sale.saleDate) || 0)
      ];
    })
  });

  const pdfBlob = doc.output("blob");
  await downloadBlobFile(`sai-${type}-report-${getTodayISODate()}.pdf`, pdfBlob, "application/pdf");
}

async function exportDailySummaryToExcel() {
  const { rows, grand } = buildDailySummaryData(monthlySalesCache);
  if (!rows.length) {
    window.alert("No daily report data available for export.");
    return;
  }

  const csvRows = [["Date", "Total Qty", "Online Total", "Cash Total", "Grand Total"]];
  rows.forEach((row) => {
    csvRows.push([
      row.date,
      formatKgGram(row.quantityKg),
      row.online,
      row.cash,
      row.total
    ]);
  });

  csvRows.push([
    "All Days Sum",
    formatKgGram(grand.quantityKg),
    grand.online,
    grand.cash,
    grand.total
  ]);

  const csv = toCsv(csvRows);
  await downloadFile(`sai-daily-summary-${getTodayISODate()}.csv`, csv, "text/csv;charset=utf-8;");
}

async function exportDailySummaryToPdf() {
  const { rows, grand } = buildDailySummaryData(monthlySalesCache);
  if (!rows.length) {
    window.alert("No daily report data available for export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Sai Green House Paper", 14, 16);
  doc.setFontSize(11);
  doc.text("Daily Total Separate Report", 14, 24);
  doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 30);

  doc.autoTable({
    startY: 36,
    head: [["Date", "Total Qty", "Online Total", "Cash Total", "Grand Total"]],
    body: [
      ...rows.map((row) => [
        row.date,
        formatKgGram(row.quantityKg),
        formatINR(row.online),
        formatINR(row.cash),
        formatINR(row.total)
      ]),
      [
        "All Days Sum",
        formatKgGram(grand.quantityKg),
        formatINR(grand.online),
        formatINR(grand.cash),
        formatINR(grand.total)
      ]
    ]
  });

  const pdfBlob = doc.output("blob");
  await downloadBlobFile(`sai-daily-summary-${getTodayISODate()}.pdf`, pdfBlob, "application/pdf");
}

function handleRowActions(event) {
  const actionBtn = event.target.closest("button[data-action]");
  if (!actionBtn) {
    return;
  }

  const action = actionBtn.dataset.action;
  const saleId = actionBtn.dataset.id;

  if (!saleId) {
    return;
  }

  if (action === "delete") {
    deleteSale(saleId);
    return;
  }

  const sale = loadSales().find((item) => item.id === saleId);
  if (!sale) {
    return;
  }

  if (action === "whatsapp") {
    openWhatsAppBill(sale);
    return;
  }

  if (action === "sms") {
    openSmsBill(sale);
    return;
  }

  if (action === "edit") {
    setEditMode(sale);
  }
}

function renderCustomerReport(sales, query) {
  const grouped = new Map();

  sales.forEach((sale) => {
    const key = sale.customerName.toLowerCase();

    if (!grouped.has(key)) {
      grouped.set(key, {
        customerName: sale.customerName,
        customerVillage: sale.customerVillage || "-",
        customerNumber: sale.customerNumber || "-",
        quantityKg: 0,
        total: 0,
        online: 0,
        cash: 0,
        lastDate: sale.saleDate
      });
    }

    const bucket = grouped.get(key);
    bucket.quantityKg += sale.quantityKg;
    bucket.total += sale.total;
    if (sale.paymentMode === "Cash") {
      bucket.cash += sale.total;
    } else {
      bucket.online += sale.total;
    }

    if (sale.saleDate > bucket.lastDate) {
      bucket.lastDate = sale.saleDate;
    }
  });

  const rows = Array.from(grouped.values())
    .filter((entry) => {
      if (!query) {
        return true;
      }
      const q = query.toLowerCase();
      return (
        entry.customerName.toLowerCase().includes(q) ||
        String(entry.customerVillage).toLowerCase().includes(q) ||
        String(entry.customerNumber).toLowerCase().includes(q)
      );
    })
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate))
    .map(
      (entry) =>
        `<tr>
          <td>${entry.customerName}</td>
          <td>${entry.customerVillage}</td>
          <td>${entry.customerNumber}</td>
          <td>${formatKgGram(entry.quantityKg)}</td>
          <td>${formatINR(entry.total)}</td>
          <td>${entry.lastDate}</td>
        </tr>`
    );

  renderTableRows(customerReportBody, rows, "No customer report found.", 6);
}

async function syncSaleToGoogleSheet(sale) {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl) {
    return;
  }

  const payload = {
    type: "sale",
    date: sale.saleDate,
    name: sale.customerName,
    village: sale.customerVillage || "",
    customerNumber: sale.customerNumber || "",
    kg: sale.quantityKg,
    quantityLabel: formatKgGram(sale.quantityKg),
    rate: sale.rate,
    total: sale.total,
    paymentMode: sale.paymentMode
  };

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch {
    window.alert("Google Sheet sync failed. Check script URL and internet.");
  }
}

function isValidPurchaseData(purchase) {
  return Boolean(purchase && purchase.purchaseDate && purchase.purchaseKg > 0 && purchase.purchaseRate > 0);
}

async function syncPurchaseToGoogleSheet(purchase, options = {}) {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl || !isValidPurchaseData(purchase)) {
    return false;
  }

  const payload = {
    type: "purchase",
    date: purchase.purchaseDate,
    source: purchase.source || "",
    purchaseKg: purchase.purchaseKg,
    purchaseRate: purchase.purchaseRate,
    purchaseTotal: purchase.purchaseTotal,
    transportFare: purchase.transportFare,
    grandTotal: purchase.grandTotal,
    quantityLabel: formatKgGram(purchase.purchaseKg)
  };

  try {
    await fetch(scriptUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return true;
  } catch {
    if (!options.silent) {
      window.alert("Purchase Google Sheet sync failed. Check script URL and internet.");
    }
    return false;
  }
}

async function syncAllSalesToGoogleSheet() {
  const scriptUrl = getGoogleScriptUrl();
  if (!scriptUrl) {
    window.alert("पहिले Google Sheet Sync URL save करा.");
    return;
  }

  const sales = loadSales();
  if (!sales.length) {
    window.alert("Sync साठी dashboard मध्ये data नाही.");
    return;
  }

  const shouldSync = window.confirm(
    `Dashboard मधला सर्व data (${sales.length} entries) Google Sheet ला पाठवायचा का?`
  );
  if (!shouldSync) {
    return;
  }

  syncStatusText.textContent = "Sheet sync: Uploading all data...";
  for (const sale of sales) {
    await syncSaleToGoogleSheet(sale);
  }
  syncStatusText.textContent = "Sheet sync: On (All dashboard data uploaded)";
  window.alert("सर्व dashboard data Google Sheet मध्ये पाठवला.");
}

function initializeQuickNav() {
  if (quickNavInitialized || !quickNavLinks.length) {
    return;
  }

  const sectionIds = quickNavLinks.map((link) => link.dataset.target).filter(Boolean);
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  quickNavLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.dataset.target;
      const targetSection = targetId ? document.getElementById(targetId) : null;
      if (!targetSection) {
        return;
      }

      event.preventDefault();
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      quickNavLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleSection) {
          return;
        }

        const activeId = visibleSection.target.id;
        quickNavLinks.forEach((link) => {
          link.classList.toggle("active", link.dataset.target === activeId);
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0.2, 0.5, 0.75]
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  quickNavLinks[0].classList.add("active");
  quickNavInitialized = true;
}

// DASHBOARD INITIALIZATION - called only after user logs in
function initializeDashboard() {
  // Clear all purchase fields on dashboard load to ensure blank start
  resetPurchaseFields();
  initializeQuickNav();

  saleForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const customerName = customerNameInput.value.trim();
  const customerVillage = customerVillageInput.value.trim();
  const customerNumber = customerNumberInput.value.trim();
  const quantity = getQuantityValues();
  const quantityKg = toTotalKg(quantity.kg, quantity.gram);
  const saleDate = saleDateInput.value;
  const paymentMode = paymentModeInput.value === "Cash" ? "Cash" : "Online";
  const billSendMode = billSendModeInput.value;

  if (!customerName || !customerVillage || !customerNumber || quantityKg <= 0 || !saleDate) {
    return;
  }

  const sales = loadSales();
  const editingId = editingSaleIdInput.value;

  if (editingId) {
    let updatedSale = null;
    const updatedSales = sales.map((sale) => {
      if (sale.id !== editingId) {
        return sale;
      }
      updatedSale = {
        ...sale,
        customerName,
        customerVillage,
        customerNumber,
        quantityKg,
        quantityGram: quantity.gram,
        saleDate,
        paymentMode,
        rate: PRICE_PER_KG,
        total: quantityKg * PRICE_PER_KG
      };
      return updatedSale;
    });

    saveSales(updatedSales);
    sendBillByMode(updatedSale, billSendMode);
  } else {
    const newSale = {
      id: crypto.randomUUID(),
      customerName,
      customerVillage,
      customerNumber,
      quantityKg,
      quantityGram: quantity.gram,
      saleDate,
      paymentMode,
      rate: PRICE_PER_KG,
      total: quantityKg * PRICE_PER_KG,
      createdAt: new Date().toISOString()
    };

    sales.push(newSale);
    saveSales(sales);
    await syncSaleToGoogleSheet(newSale);
    sendBillByMode(newSale, billSendMode);
  }

  resetFormToAddMode();
  renderDashboard();
});

quantityKgInput.addEventListener("input", updateLiveTotal);
quantityGramInput.addEventListener("input", updateLiveTotal);
customerSearchInput.addEventListener("input", renderDashboard);

if (exportPurchasePdfBtn) {
  exportPurchasePdfBtn.addEventListener("click", () => {
    exportPurchaseToPdf();
  });
}

if (savePurchaseToSheetBtn) {
  savePurchaseToSheetBtn.addEventListener("click", async () => {
    const purchase = getPurchaseSnapshot();
    if (!isValidPurchaseData(purchase)) {
      window.alert("Purchase KG, Rate आणि Date योग्य टाका.");
      return;
    }

    const synced = await syncPurchaseToGoogleSheet(purchase);
    if (synced) {
      window.alert("Purchase data Google Sheet मध्ये save झाला.");
    }
  });
}

if (clearPurchaseDataBtn) {
  clearPurchaseDataBtn.addEventListener("click", () => {
    const shouldClearPurchase = window.confirm("Purchase calculator data clear करायचा का?");
    if (!shouldClearPurchase) {
      return;
    }

    resetPurchaseFields();
    window.alert("Purchase calculator data clear झाला.");
  });
}

todaySalesBody.addEventListener("click", handleRowActions);
monthlySalesBody.addEventListener("click", handleRowActions);

cancelEditBtn.addEventListener("click", resetFormToAddMode);
saveGoogleScriptBtn.addEventListener("click", saveGoogleScriptUrl);
if (syncAllToSheetBtn) {
  syncAllToSheetBtn.addEventListener("click", () => {
    syncAllSalesToGoogleSheet();
  });
}

exportTodayExcelBtn.addEventListener("click", () => {
  exportSalesToExcel("today");
});

exportMonthlyExcelBtn.addEventListener("click", () => {
  exportSalesToExcel("monthly");
});

exportTodayPdfBtn.addEventListener("click", () => {
  exportSalesToPdf("today");
});

exportMonthlyPdfBtn.addEventListener("click", () => {
  exportSalesToPdf("monthly");
});

exportDailyExcelBtn.addEventListener("click", () => {
  exportDailySummaryToExcel();
});

exportDailyPdfBtn.addEventListener("click", () => {
  exportDailySummaryToPdf();
});

clearDataBtn.addEventListener("click", async () => {
  const shouldClear = window.confirm(
    "Dashboard वरचा local data clear करायचा का? Google Sheet मधला data delete होणार नाही."
  );
  if (!shouldClear) {
    return;
  }

  const purchase = getPurchaseSnapshot();
  if (isValidPurchaseData(purchase)) {
    await syncPurchaseToGoogleSheet(purchase, { silent: true });
  }

  localStorage.removeItem(STORAGE_KEY);
  renderDashboard();
  window.alert("Dashboard data clear झाला. Sales आणि Purchase backup Google Sheet मध्ये सुरक्षित आहे.");
});

if (installAppBtn) {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installAppBtn.classList.remove("hidden");
  });

  installAppBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      window.alert("Install option उपलब्ध नसेल तर browser menu > Add to Home Screen वापरा.");
      return;
    }

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;

    if (choice && choice.outcome === "accepted") {
      installAppBtn.classList.add("hidden");
    }
  });

  window.addEventListener("appinstalled", () => {
    installAppBtn.classList.add("hidden");
  });
}

  yearEl.textContent = new Date().getFullYear();
  googleScriptUrlInput.value = getGoogleScriptUrl();
  updateSyncStatus();
  resetFormToAddMode();
  updatePurchaseTotal();
  renderDashboard();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        // Ignore registration failure in restricted environments.
      });
    });
  }
}
