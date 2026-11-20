# HƯỚNG DẪN ĐỒNG BỘ LEAD TỪ WEBSITE VÀO BẢNG TÍNH GOOGLE SHEETS & THÔNG BÁO GMAIL

**Link Bảng Tính:** [Google Spreadsheet MaxSoft](https://docs.google.com/spreadsheets/d/1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50/edit?usp=sharing)  
**Tab Nhận Lead:** `Nhật Ký Lead & Khách Hàng`

---

## 1. TÍNH NĂNG THÔNG BÁO VỀ GMAIL TỨC THÌ
Mỗi khi có khách điền form, một email thông báo sẽ tự động gửi về Gmail với giao diện HTML thương hiệu MaxSoft:
- **Tự động quét danh sách nhận:** Hệ thống tự động gửi tới **TẤT CẢ các Gmail được chia sẻ quyền Xem (Viewers)** và **quyền Chỉnh sửa (Editors)** trên bảng tính Google Sheet (không cần phải nhập từng email thủ công).
- **Thông tin đầy đủ:** STT, Họ tên, SĐT, Công ty, Gói quan tâm, Nguồn và Thời gian nhận.
- **Nút 1: 📞 GỌI NGAY: [SĐT]** (Màu xanh lá) - Nhấp vào để gọi điện thoại trực tiếp cho khách ngay trên điện thoại hoặc máy tính.
- **Nút 2: 📊 MỞ DATA LEAD** (Màu xanh đậm) - Nhấp vào để mở trực tiếp bảng tính Google Sheet để xử lý.
- **Nút phụ trợ: 💬 Chat Zalo** - Nhấp vào để mở nhanh cửa sổ chat Zalo với số điện thoại của khách.

*Bạn cũng có thể cấu hình bổ sung thêm email bên ngoài trong file [`google-apps-script.js`](../tools/google-sheets/google-apps-script.js) tại biến `NOTIFICATION_EMAILS` nếu muốn.*

---

## 2. CẤU TRÚC FORM 12 CỘT TỰ ĐỘNG ĐƯỢC ĐIỀN TỪ DÒNG 5:
- **Cột 1 (A) - STT:** Tự động tăng (`1`, `2`, `3`...) tương ứng theo số lượng lead thực tế.
- **Cột 2 (B) - Ngày Nhận:** Ngày giờ đăng ký theo giờ GMT+7 Việt Nam.
- **Cột 3 (C) - Họ Tên Khách Hàng:** Lấy từ ô `Họ và tên` của form.
- **Cột 4 (D) - SĐT / Zalo:** Lấy từ ô `Số điện thoại (Zalo)` (bảo toàn số 0 ở đầu).
- **Cột 5 (E) - Tên Công Ty / Xưởng Sản Xuất:** Lấy từ ô `Tên công ty & Lĩnh vực sản xuất`.
- **Cột 6 (F) - Ngành Nghề:** Để trống cho nhân sự phân loại.
- **Cột 7 (G) - Nguồn Tiếp Cận:** Tự động nhận diện `Landing Page` hoặc `Ads Form Facebook` (khi khách đến từ Facebook/có `fbclid`).
- **Cột 8 (H) - Nhu Cầu Quan Tâm / Vấn Đề:** Tự động điền gói giải pháp đã chọn (ví dụ: *Demo tổng quan 30 phút*, *Founding Member*...).
- **Cột 9 (I) - Người Trực Phản Hồi:** Để trống để nhân viên trực ca tự nhận.
- **Cột 10 (J) - Thời Gian Phản Hồi (phút):** Để trống để nhân sự điền thời gian SLA.
- **Cột 11 (K) - Trạng Thái Xử Lý:** Tự động gán `"Mới"` (Khớp danh mục dropdown cột K, tô màu cam vàng nổi bật).
- **Cột 12 (L) - Ghi Chú & Kế Hoạch Tiếp Theo:** Tự động ghi chi tiết nguồn UTM, Kênh tiếp cận (Facebook Ads, Google Ads...), Link giới thiệu (Referrer) và Click ID.

---

## 3. HỆ THỐNG TRACKING NGUỒN TRUY CẬP (UTM & FACEBOOK ADS)
Hệ thống tracking đã được tích hợp sẵn trên Landing Page:
1. **Tự động bắt nguồn:** Khi khách bấm vào link quảng cáo hoặc link chia sẻ:
   - Các tham số UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`.
   - Click ID quảng cáo: `fbclid` (Facebook), `gclid` (Google Ads), `ttclid` (TikTok).
   - Link giới thiệu: `document.referrer` (Facebook, Zalo, Google, website khác).
2. **Lưu trữ phiên (Session Persistence):** Lưu vào `sessionStorage` để dù khách xem nhiều trang hoặc xem sau 10 phút vẫn giữ trọn vẹn nguồn ban đầu.
3. **Sẵn sàng cho Pixel / Conversion API:** Đã tạo sẵn hook kích hoạt sự kiện:
   - `fbq('track', 'Lead', ...)` khi bạn gắn mã Facebook Pixel sau này.
   - `gtag('event', 'generate_lead', ...)` khi bạn gắn mã Google Tag Manager sau này.

---

## 4. 3 BƯỚC ĐỒNG BỘ LÊN GOOGLE APPS SCRIPT:

### BƯỚC 1: Mở trình soạn thảo Apps Script trên Bảng tính
1. Mở link bảng tính:  
   👉 [https://docs.google.com/spreadsheets/d/1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50/edit](https://docs.google.com/spreadsheets/d/1ZjXW8mmH-mWSPeooCpZ8PF2TxqZDen5TiT6Bk9rGb50/edit)
2. Trên thanh menu, chọn: **Tiện ích mở rộng** *(Extensions)* ➔ **Apps Script**.

### BƯỚC 2: Cập nhật mã nguồn & Cấp quyền gửi Email
1. Mở file [google-apps-script.js](../tools/google-sheets/google-apps-script.js) trong dự án.
2. Sao chép (Copy) toàn bộ nội dung trong file.
3. Dán đè vào ô soạn thảo mã nguồn của Apps Script.
4. Bấm icon **Lưu** *(Save / Ctrl + S)*.
5. *(Khuyên dùng)* Trên thanh công cụ Apps Script, chọn hàm `testSendEmail` rồi bấm nút **Chạy (Run)** để Google cấp quyền gửi email và gửi thử 1 email mẫu về Gmail của bạn kiểm tra.

### BƯỚC 3: Triển khai Web App (Deploy) - ⚠️ QUAN TRỌNG NHẤT:
1. Ở góc trên bên phải màn hình Apps Script, bấm nút **Triển khai** *(Deploy)*:
   - Chọn **Quản lý bản triển khai** *(Manage deployments)*.
   - Bấm icon **Cây bút** *(Chỉnh sửa / Edit)* ở bản triển khai hiện tại.
   - Mục **Phiên bản** *(Version)*: Chọn **Phiên bản mới** *(New version)*.
   - Mục **Thực thi dưới dạng** *(Execute as)*: Chọn **Tôi** *(Me - tài khoản Google của bạn)*.
   - Mục **Ai có quyền truy cập** *(Who has access)*: **BẮT BUỘC CHỌN "Bất kỳ ai" (Anyone)**.
     > ⚠️ **LƯU Ý QUAN TRỌNG:** Nếu chọn *"Chỉ mình tôi"* hoặc *"Người trong tổ chức"*, Google sẽ chặn và trả về lỗi `403 Forbidden`, khiến website không thể gửi lead vào bảng tính!
   - Bấm **Triển khai** *(Deploy)*.
2. URL Web App hiện tại đã được cấu hình tự động trong [index.html](../index.html):
   ```javascript
   var GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzS-vOCp2jzfK3JPtL9TzuqbtBUecbRbfRarLe0qHLTbvl6Du3fA8t4ZKX2k0f6UXDL/exec';
   ```
