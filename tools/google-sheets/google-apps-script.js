/**
 * ==============================================================================
 * GOOGLE APPS SCRIPT - TỰ ĐỘNG GHI LEAD VÀO TAB "Nhật Ký Lead & Khách Hàng"
 * VÀ GỬI EMAIL THÔNG BÁO TỨC THÌ VỀ GMAIL (KÈM NÚT GỌI NGAY & MỞ DATA)
 * SPREADSHEET: https://docs.google.com/spreadsheets/d/1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50/edit
 * ==============================================================================
 * 
 * BẢNG TÍNH ĐÍCH:
 * Tab: "Nhật Ký Lead & Khách Hàng"
 * Tiêu đề bảng tại Dòng 4 gồm 12 cột:
 *   1. STT
 *   2. Ngày Nhận
 *   3. Họ Tên Khách Hàng
 *   4. SĐT / Zalo
 *   5. Tên Công Ty / Xưởng Sản Xuất
 *   6. Ngành Nghề
 *   7. Nguồn Tiếp Cận
 *   8. Nhu Cầu Quan Tâm / Vấn Đề Cần Giải Quyết
 *   9. Người Trực Phản Hồi
 *   10. Thời Gian Phản Hồi (phút)
 *   11. Trạng Thái Xử Lý
 *   12. Ghi Chú & Kế Hoạch Tiếp Theo
 *
 * HƯỚNG DẪN CẬP NHẬT TRONG 2 PHÚT (KHẮC PHỤC TRIỆT ĐỂ LỖI KHÔNG HIỂN THỊ LEAD):
 * ------------------------------------------------------------------------------
 * Bước 1: Mở Google Sheet:
 *         https://docs.google.com/spreadsheets/d/1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50/edit
 * 
 * Bước 2: Vào menu "Tiện ích mở rộng" (Extensions) -> "Apps Script".
 * 
 * Bước 3: Xóa toàn bộ mã cũ trong ô soạn thảo, copy toàn bộ nội dung file này dán vào.
 *         Bấm icon Đĩa mềm (Save / Ctrl+S).
 * 
 * Bước 4: CẤU HÌNH QUYỀN TRUY CẬP VÀ TRIỂN KHAI (QUAN TRỌNG NHẤT):
 *         - Bấm "Triển khai" (Deploy) góc trên phải -> "Quản lý bản triển khai" (Manage deployments).
 *         - Bấm biểu tượng Cây bút (Chỉnh sửa / Edit) ở bản triển khai Web App.
 *         - Mục "Phiên bản" (Version): Chọn "Phiên bản mới" (New version).
 *         - Mục "Thực thi dưới dạng" (Execute as): Chọn "Tôi" (Me).
 *         - Mục "Ai có quyền truy cập" (Who has access): BẮT BUỘC CHỌN "Bất kỳ ai" (Anyone)
 *           (LƯU Ý: Nếu chọn "Chỉ mình tôi", Google sẽ chặn 403 khiến form không ghi được vào Sheet!)
 *         - Bấm "Triển khai" (Deploy).
 *         - Copy URL Web App mới (nếu có thay đổi) và gửi lại cho tôi.
 * ==============================================================================
 */

var SPREADSHEET_ID = "1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50";
var SHEET_NAME = "Nhật Ký Lead & Khách Hàng";

// ==============================================================================
// CẤU HÌNH THÔNG BÁO QUA GMAIL
// ==============================================================================
var ENABLE_EMAIL_NOTIFICATION = true; // true: BẬT gửi email, false: TẮT

// TỰ ĐỘNG GỬI TỚI TẤT CẢ GMAIL ĐƯỢC CHIA SẺ TRÊN GOOGLE SHEET:
var NOTIFY_SHEET_VIEWERS = true; // true: Gửi cho tất cả Gmail được chia sẻ quyền Xem (Viewers/Commenters)
var NOTIFY_SHEET_EDITORS = true; // true: Gửi cho tất cả Gmail được chia sẻ quyền Sửa (Editors) & Chủ sở hữu (Owner)

// Điền thêm email nhận thông báo thủ công nếu muốn (cách nhau bởi dấu phẩy, ví dụ: "sales@gmail.com, ceo@gmail.com")
// Nếu để trống "", hệ thống sẽ tự động quét danh sách các Gmail được chia sẻ quyền xem/sửa trên Sheet + Chủ sở hữu
var NOTIFICATION_EMAILS = ""; 

/**
 * Lấy đúng sheet "Nhật Ký Lead & Khách Hàng" từ SPREADSHEET_ID
 */
function getLeadSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (err) {
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {}
  }

  if (!ss) {
    throw new Error("Không thể mở bảng tính với ID: " + SPREADSHEET_ID);
  }

  // 1. Tìm chính xác theo tên SHEET_NAME
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (sheet) return sheet;

  // 2. Tìm kiếm thông minh theo từ khóa trong tên tab ("lead", "khách hàng", "nhật ký")
  var allSheets = ss.getSheets();
  for (var i = 0; i < allSheets.length; i++) {
    var sName = allSheets[i].getName().toLowerCase().trim();
    if (sName.indexOf("lead") !== -1 || sName.indexOf("khách hàng") !== -1 || sName.indexOf("nhật ký") !== -1) {
      return allSheets[i];
    }
  }

  // 3. Tab thứ 4 trong bảng tính MaxSoft là "Nhật Ký Lead & Khách Hàng"
  if (allSheets.length >= 4) {
    return allSheets[3];
  }

  return allSheets[0];
}

/**
 * Lấy toàn bộ danh sách Gmail nhận thông báo:
 * Tự động quét các tài khoản Gmail được chia sẻ quyền Xem (Viewers), 
 * quyền Chỉnh sửa (Editors), Chủ sở hữu Sheet và email bổ sung.
 */
function getAllRecipientEmails() {
  var emailMap = {};
  var recipients = [];

  function addEmail(email) {
    if (!email) return;
    email = email.toString().trim().toLowerCase();
    if (email.indexOf("@") !== -1 && !emailMap[email]) {
      emailMap[email] = true;
      recipients.push(email);
    }
  }

  // 1. Email cấu hình thủ công trong NOTIFICATION_EMAILS (nếu có)
  if (NOTIFICATION_EMAILS && NOTIFICATION_EMAILS.trim() !== "") {
    var customList = NOTIFICATION_EMAILS.split(",");
    for (var c = 0; c < customList.length; c++) {
      addEmail(customList[c]);
    }
  }

  // 2. Tự động quét từ Google Spreadsheet MaxSoft (Quyền xem & Quyền chỉnh sửa)
  try {
    var ss;
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {
      try {
        ss = SpreadsheetApp.getActiveSpreadsheet();
      } catch (errAct) {}
    }

    if (ss) {
      // Lấy danh sách Gmail được chia sẻ quyền XEM (Viewers / Commenters)
      if (NOTIFY_SHEET_VIEWERS) {
        var viewers = ss.getViewers();
        for (var v = 0; v < viewers.length; v++) {
          try {
            addEmail(viewers[v].getEmail());
          } catch (eView) {
            Logger.log("Lỗi đọc email viewer: " + eView.toString());
          }
        }
      }

      // Lấy danh sách Gmail được chia sẻ quyền SỬA (Editors) & Chủ sở hữu (Owner)
      if (NOTIFY_SHEET_EDITORS) {
        var editors = ss.getEditors();
        for (var ed = 0; ed < editors.length; ed++) {
          try {
            addEmail(editors[ed].getEmail());
          } catch (eEd) {
            Logger.log("Lỗi đọc email editor: " + eEd.toString());
          }
        }
        try {
          var owner = ss.getOwner();
          if (owner) addEmail(owner.getEmail());
        } catch (eOwn) {
          Logger.log("Lỗi đọc email owner: " + eOwn.toString());
        }
      }
    }
  } catch (errSheet) {
    Logger.log("Không thể đọc danh sách chia sẻ từ Sheet: " + errSheet.toString());
  }

  // 3. Email người tạo/chạy Script (Session user)
  try {
    var effectiveEmail = Session.getEffectiveUser().getEmail();
    addEmail(effectiveEmail);
    var activeEmail = Session.getActiveUser().getEmail();
    addEmail(activeEmail);
  } catch (eSess) {}

  // Fallback nếu không tìm thấy email nào
  if (recipients.length === 0) {
    recipients.push("contact@maxsoft.vn");
  }

  return recipients;
}

/**
 * Xử lý GET: Kiểm tra kết nối Web App qua trình duyệt
 */
function doGet(e) {
  var sheet = getLeadSheet();
  var recipients = getAllRecipientEmails();
  return ContentService.createTextOutput(JSON.stringify({
    status: "ready",
    message: "Google Apps Script nhận Lead MaxSoft đang kết nối chính xác tới tab: " + sheet.getName(),
    spreadsheetId: sheet.getParent().getId(),
    sheetName: sheet.getName(),
    emailAlertEnabled: ENABLE_EMAIL_NOTIFICATION,
    recipientEmails: recipients,
    recipientCount: recipients.length,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Xử lý POST: Tiếp nhận lead, chống trùng lặp, ghi sheet và gửi thông báo Gmail
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Hệ thống đang bận ghi dữ liệu, vui lòng thử lại sau giây lát."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = getLeadSheet();

    // Đọc dữ liệu từ request
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var name = (data.name || "").toString().trim();
    var phone = (data.phone || "").toString().trim();
    var company = (data.company || "").toString().trim();
    var rawPackage = (data.package || data.packageName || "Demo tổng quan 30 phút").toString().trim();
    var packageName = rawPackage;
    if (rawPackage.toLowerCase().indexOf("30") !== -1 || rawPackage.toLowerCase().indexOf("demo") !== -1) {
      packageName = "Demo tổng quan 30 phút";
    }

    // Nhận diện kênh tiếp cận, UTM và Click ID (Facebook Ads, Google Ads, Referrer)
    var channel = (data.channel || "").toString().trim();
    var referrer = (data.referrer || "").toString().trim();
    var utmSource = (data.utm_source || "").toString().trim();
    var utmMedium = (data.utm_medium || "").toString().trim();
    var utmCampaign = (data.utm_campaign || "").toString().trim();
    var utmContent = (data.utm_content || "").toString().trim();
    var utmTerm = (data.utm_term || "").toString().trim();
    var fbclid = (data.fbclid || "").toString().trim();
    var gclid = (data.gclid || "").toString().trim();

    // Nguồn tiếp cận: Khớp 100% danh mục dropdown cột G của Sheet ("Landing Page" hoặc "Ads Form Facebook")
    var source = "Landing Page";
    if (data.source && (data.source === "Ads Form Facebook" || data.source === "Tin nhắn trực tiếp" || data.source.indexOf("Bài viết") !== -1)) {
      source = data.source;
    } else if (channel.toLowerCase().indexOf("facebook") !== -1 || fbclid !== "") {
      source = "Ads Form Facebook";
    }

    var industry = (data.industry || "").toString().trim();
    var pageUrl = (data.page_url || "").toString().trim();

    if (!name || !phone) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Thiếu thông tin họ tên hoặc số điện thoại."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Định dạng thời gian theo múi giờ Việt Nam
    var timeZone = Session.getScriptTimeZone() || "Asia/Ho_Chi_Minh";
    var nowFormatted = Utilities.formatDate(new Date(), timeZone, "dd/MM/yyyy HH:mm:ss");

    // Giữ nguyên số 0 ở đầu số điện thoại
    var cleanPhone = phone.indexOf("'") === 0 ? phone : ("'" + phone);

    // ============================================================================
    // 1. TỰ ĐỘNG XÁC ĐỊNH DÒNG TIÊU ĐỀ (HEADER ROW)
    // ============================================================================
    // Quét cột C để tìm chính xác dòng chứa tiêu đề "Họ Tên Khách Hàng"
    var headerRow = 5; // Mặc định dòng 5
    var scanRange = Math.max(sheet.getLastRow(), 25);
    var colCAll = sheet.getRange(1, 3, scanRange, 1).getValues();
    for (var h = 0; h < colCAll.length; h++) {
      var cellText = (colCAll[h][0] || "").toString().toLowerCase().trim();
      if (cellText.indexOf("họ tên") !== -1) {
        headerRow = h + 1; // 1-indexed trong Sheet
        break;
      }
    }

    // Dòng dữ liệu đầu tiên bắt buộc nằm ngay sau dòng tiêu đề
    var firstDataRow = headerRow + 1;

    // ============================================================================
    // 2. TÌM DÒNG TRỐNG TIẾP THEO ĐỂ GHI LEAD
    // ============================================================================
    // Quét từ dòng firstDataRow trở xuống để tìm dòng trống tiếp theo
    var maxCheck = Math.max(sheet.getLastRow() + 5, firstDataRow + 30);
    var numRowsToCheck = maxCheck - firstDataRow + 1;
    var colCD = sheet.getRange(firstDataRow, 3, numRowsToCheck, 2).getValues();
    var nextRow = firstDataRow;

    for (var i = 0; i < colCD.length; i++) {
      var rowName = (colCD[i][0] || "").toString().trim();
      var rowPhone = (colCD[i][1] || "").toString().trim();
      if (rowName !== "" || rowPhone !== "") {
        nextRow = firstDataRow + i + 1;
      }
    }

    // ============================================================================
    // 3. KIỂM TRA CHỐNG TRÙNG LẶP (ANTI-DUPLICATE)
    // ============================================================================
    if (nextRow > firstDataRow) {
      var prevName = (sheet.getRange(nextRow - 1, 3).getValue() || "").toString().trim();
      var prevPhone = (sheet.getRange(nextRow - 1, 4).getValue() || "").toString().trim();
      if (prevPhone.indexOf("'") === 0) prevPhone = prevPhone.substring(1);
      var currentPhone = phone.indexOf("'") === 0 ? phone.substring(1) : phone;

      if (prevPhone === currentPhone && prevName === name) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "success",
          message: "Lead đã được ghi nhận trước đó.",
          isDuplicate: true
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // ============================================================================
    // 4. TÍNH STT CHUẨN XÁC 100%
    // ============================================================================
    // - Dòng đầu tiên ngay sau header (firstDataRow): STT BẮT BUỘC là 1!
    // - Các dòng tiếp theo: STT = STT dòng trước + 1
    var stt = 1;
    if (nextRow === firstDataRow) {
      stt = 1;
    } else {
      var prevSttVal = sheet.getRange(nextRow - 1, 1).getValue();
      var prevStt = parseInt(prevSttVal, 10);
      if (!isNaN(prevStt) && prevStt >= 1) {
        stt = prevStt + 1;
      } else {
        stt = nextRow - headerRow;
      }
    }

    // Xây dựng Ghi chú & Kế hoạch tiếp theo (Cột 12 - L) kèm chi tiết nguồn truy cập / UTM / Click ID:
    var noteParts = [];
    if (channel) noteParts.push("Kênh: " + channel);
    if (utmSource) noteParts.push("UTM Source: " + utmSource);
    if (utmCampaign) noteParts.push("Campaign: " + utmCampaign);
    if (utmMedium) noteParts.push("Medium: " + utmMedium);
    if (utmContent) noteParts.push("Content: " + utmContent);
    if (fbclid) noteParts.push("fbclid: " + fbclid.substring(0, 15) + "...");
    if (gclid) noteParts.push("gclid: " + gclid.substring(0, 15) + "...");
    if (referrer) noteParts.push("Từ web: " + referrer);

    var noteDetail = noteParts.length > 0 ? (" [" + noteParts.join(" | ") + "]") : "";
    var fullNote = "Đăng ký từ Landing Page" + noteDetail + (pageUrl ? " (" + pageUrl + ")" : "");

    // 12 cột tương ứng form mẫu của Tab "Nhật Ký Lead & Khách Hàng":
    // Lưu ý: Cột 7 (G) là "Landing Page", Cột 11 (K) là "Mới" để khớp 100% dropdown xác thực của Google Sheet
    var newRow = [
      stt,                          // Col 1 (A): STT
      nowFormatted,                 // Col 2 (B): Ngày Nhận
      name,                         // Col 3 (C): Họ Tên Khách Hàng
      cleanPhone,                   // Col 4 (D): SĐT / Zalo
      company,                      // Col 5 (E): Tên Công Ty / Xưởng Sản Xuất
      industry,                     // Col 6 (F): Ngành Nghề
      source,                       // Col 7 (G): Nguồn Tiếp Cận ("Landing Page" hoặc "Ads Form Facebook")
      packageName,                  // Col 8 (H): Nhu Cầu Quan Tâm / Vấn Đề Cần Giải Quyết
      "",                           // Col 9 (I): Người Trực Phản Hồi (để trống cho ca trực nhận)
      "",                           // Col 10 (J): Thời Gian Phản Hồi (phút)
      "Mới",                        // Col 11 (K): Trạng Thái Xử Lý ("Mới")
      fullNote                      // Col 12 (L): Ghi Chú & Kế Hoạch Tiếp Theo (kèm chi tiết UTM)
    ];

    // Ghi dữ liệu an toàn vào đúng dòng
    try {
      sheet.getRange(nextRow, 1, 1, 12).setValues([newRow]);
    } catch (valErr) {
      Logger.log("Lỗi ghi cả dòng (có thể do Data Validation): " + valErr.toString());
      // Cơ chế dự phòng: ghi từng ô để không bao giờ bị mất bất kỳ thông tin nào của khách
      for (var col = 1; col <= 12; col++) {
        try {
          sheet.getRange(nextRow, col).setValue(newRow[col - 1]);
        } catch (cellErr) {
          Logger.log("Lỗi ghi ô cột " + col + ": " + cellErr.toString());
        }
      }
    }

    // Định dạng giao diện cho dòng mới
    sheet.getRange(nextRow, 1).setHorizontalAlignment("center"); // STT
    sheet.getRange(nextRow, 2).setHorizontalAlignment("center"); // Ngày nhận
    sheet.getRange(nextRow, 4).setHorizontalAlignment("center"); // SĐT
    sheet.getRange(nextRow, 7).setHorizontalAlignment("center"); // Nguồn

    // Tô màu trạng thái "Mới" (vàng cam nhạt)
    var statusCell = sheet.getRange(nextRow, 11);
    statusCell.setValue("Mới");
    statusCell.setHorizontalAlignment("center");
    statusCell.setFontWeight("bold");
    statusCell.setBackground("#FEF3C7");
    statusCell.setFontColor("#92400E");

    // ============================================================================
    // GỬI EMAIL THÔNG BÁO VỀ GMAIL (KÈM NÚT GỌI NGAY & MỞ DATA LEAD)
    // ============================================================================
    var emailStatus = null;
    if (ENABLE_EMAIL_NOTIFICATION) {
      emailStatus = sendLeadEmailAlert({
        stt: stt,
        name: name,
        phone: phone,
        company: company,
        package: packageName,
        source: source,
        channel: channel,
        utmDetails: noteParts.join(" | "),
        time: nowFormatted
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đăng ký thành công!",
      data: {
        stt: stt,
        name: name,
        phone: phone,
        row: nextRow,
        emailStatus: emailStatus
      }
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Hàm gửi Email thông báo HTML chuyên nghiệp về Gmail
 * Tự động gửi tới tất cả người được chia sẻ quyền xem/sửa trên Sheet
 */
function sendLeadEmailAlert(lead) {
  try {
    var recipients = getAllRecipientEmails();
    if (!recipients || recipients.length === 0) {
      Logger.log("Không có email nhận thông báo.");
      return { success: false, reason: "Không tìm thấy email nào để gửi." };
    }

    var recipientString = recipients.join(", ");
    var sheetUrl = "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID + "/edit";
    var rawPhone = lead.phone.toString().trim();
    var telNumber = rawPhone.replace(/[^0-9+]/g, "");
    var displayPhone = rawPhone.replace(/^'/, "");

    var subject = "🔥 [LEAD #" + lead.stt + "] " + lead.name + " - " + displayPhone + " (" + lead.company + ")";

    var htmlBody = ""
      + '<div style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 20px 10px;">'
      + '  <div style="background-color: #ffffff; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">'
      + '    <!-- Header -->'
      + '    <div style="background-color: #153650; padding: 22px 20px; text-align: center;">'
      + '      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">MAXSOFT ERP · LEAD MỚI</h1>'
      + '      <p style="color: #93c5fd; margin: 6px 0 0 0; font-size: 13px;">Khách hàng vừa gửi đăng ký tư vấn qua Landing Page</p>'
      + '    </div>'
      + '    <!-- Alert SLA -->'
      + '    <div style="background-color: #FEF3C7; border-bottom: 1px solid #FDE68A; padding: 10px 20px; text-align: center;">'
      + '      <span style="color: #92400E; font-size: 13px; font-weight: 600;">⚡ Cam kết SLA: Phản hồi khách hàng trong vòng ≤ 15 phút!</span>'
      + '    </div>'
      + '    <!-- Nội dung chi tiết Lead -->'
      + '    <div style="padding: 24px 20px;">'
      + '      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 35%;">STT trong Sheet:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 700;">#' + lead.stt + '</td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Họ và tên:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 16px; font-weight: 700;">' + lead.name + '</td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Số điện thoại:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #059669; font-size: 18px; font-weight: 800;">'
      + '            <a href="tel:' + telNumber + '" style="color: #059669; text-decoration: none;">' + displayPhone + '</a>'
      + '          </td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Công ty / Xưởng:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 600;">' + lead.company + '</td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Gói quan tâm:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1d4ed8; font-size: 14px; font-weight: 600;">' + lead.package + '</td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Kênh tiếp cận:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7; font-size: 14px; font-weight: 700;">' + (lead.channel || lead.source) + '</td>'
      + '        </tr>'
      + (lead.utmDetails ? ('        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Chi tiết UTM:</td><td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px;">' + lead.utmDetails + '</td></tr>') : '')
      + '        <tr>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px;">Nguồn tiếp cận:</td>'
      + '          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #475569; font-size: 13px;">' + lead.source + '</td>'
      + '        </tr>'
      + '        <tr>'
      + '          <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Thời gian nhận:</td>'
      + '          <td style="padding: 10px 0; color: #475569; font-size: 13px;">' + lead.time + '</td>'
      + '        </tr>'
      + '      </table>'
      + '      <!-- 2 NÚT BẤM HÀNH ĐỘNG CHÍNH -->'
      + '      <div style="margin: 25px 0 10px 0;">'
      + '        <table style="width: 100%; border-collapse: separate; border-spacing: 8px 0;">'
      + '          <tr>'
      + '            <td style="width: 50%; text-align: center;">'
      + '              <a href="tel:' + telNumber + '" style="display: block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 13px 14px; border-radius: 8px; font-size: 14px; font-weight: 700; text-align: center; box-shadow: 0 2px 4px rgba(5,150,105,0.3);">'
      + '                📞 GỌI NGAY: ' + displayPhone
      + '              </a>'
      + '            </td>'
      + '            <td style="width: 50%; text-align: center;">'
      + '              <a href="' + sheetUrl + '" target="_blank" style="display: block; background-color: #153650; color: #ffffff; text-decoration: none; padding: 13px 14px; border-radius: 8px; font-size: 14px; font-weight: 700; text-align: center; box-shadow: 0 2px 4px rgba(21,54,80,0.3);">'
      + '                📊 MỞ DATA LEAD'
      + '              </a>'
      + '            </td>'
      + '          </tr>'
      + '        </table>'
      + '      </div>'
      + '      <!-- Nút Zalo phụ trợ -->'
      + '      <div style="text-align: center; margin-top: 14px;">'
      + '        <a href="https://zalo.me/' + telNumber + '" target="_blank" style="display: inline-block; color: #0284c7; text-decoration: none; font-size: 13px; font-weight: 600;">'
      + '          💬 Hoặc bấm vào đây để mở chat Zalo với khách'
      + '        </a>'
      + '      </div>'
      + '    </div>'
      + '    <!-- Footer -->'
      + '    <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 12px 20px; text-align: center;">'
      + '      <p style="color: #94a3b8; font-size: 12px; margin: 0;">'
      + '        Hệ thống tiếp nhận Lead tự động MaxSoft ERP · maxelectric.vn'
      + '      </p>'
      + '      <p style="color: #cbd5e1; font-size: 11px; margin: 4px 0 0 0;">'
      + '        Thông báo gửi tự động tới các thành viên được chia sẻ quyền trên Sheet'
      + '      </p>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    var sendSuccess = false;
    var sendMethod = "";
    var sendError = "";

    // Ưu tiên 1: Gửi qua GmailApp (gửi trực tiếp từ hộp thư Gmail của tài khoản, độ tin cậy cao nhất)
    try {
      GmailApp.sendEmail(recipientString, subject, "", {
        htmlBody: htmlBody,
        name: "MaxSoft Lead Alert"
      });
      sendSuccess = true;
      sendMethod = "GmailApp";
      Logger.log("Đã gửi email qua GmailApp tới: " + recipientString);
    } catch (gErr) {
      sendError = gErr.toString();
      Logger.log("GmailApp chưa được cấp quyền hoặc lỗi: " + sendError + ", đang thử MailApp...");
      // Ưu tiên 2: Dự phòng bằng MailApp
      try {
        MailApp.sendEmail({
          to: recipientString,
          subject: subject,
          htmlBody: htmlBody,
          name: "MaxSoft Lead Alert"
        });
        sendSuccess = true;
        sendMethod = "MailApp";
        Logger.log("Đã gửi email qua MailApp tới: " + recipientString);
      } catch (mErr) {
        sendError = "GmailApp: " + sendError + " | MailApp: " + mErr.toString();
        Logger.log("Lỗi cả 2 phương thức gửi mail: " + sendError);
      }
    }

    return {
      success: sendSuccess,
      method: sendMethod,
      recipients: recipients,
      error: sendSuccess ? null : sendError
    };

  } catch (err) {
    Logger.log("Lỗi khi chuẩn bị gửi email: " + err.toString());
    return {
      success: false,
      error: err.toString()
    };
  }
}

/**
 * Hàm kiểm tra thử tính năng gửi Email (Chạy trực tiếp trong Apps Script để cấp quyền & nhận email test)
 */
function testSendEmail() {
  var recipients = getAllRecipientEmails();
  Logger.log("=== DANH SÁCH GMAIL SẼ NHẬN THÔNG BÁO (" + recipients.length + " email) ===");
  for (var i = 0; i < recipients.length; i++) {
    Logger.log((i + 1) + ". " + recipients[i]);
  }
  sendLeadEmailAlert({
    stt: 1,
    name: "Nguyễn Văn Test",
    phone: "0912345678",
    company: "Công ty Cơ Điện Test Tân Phát",
    package: "Demo tổng quan 30 phút",
    source: "Landing Page",
    time: "20/11/2026 14:00:00"
  });
}
