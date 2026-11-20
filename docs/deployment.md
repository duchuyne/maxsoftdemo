# Hướng dẫn đưa website lên domain

Website hiện phục vụ trực tiếp từ thư mục gốc của repo. Giữ nguyên cấu trúc thư mục khi upload để các đường dẫn trong trang hoạt động.

## Upload lên hosting

Đặt các mục sau ở thư mục gốc của domain:

- `index.html`
- `assets/`
- `demos/` (trang CRM nhúng trong landing page)
- `robots.txt` và `sitemap.xml`
- `.nojekyll` nếu hosting là GitHub Pages

`api/` chỉ cần upload nếu hosting chạy PHP và bạn dùng API PHP để nhận đăng ký demo. Xem [`api/README.txt`](../api/README.txt) để cấu hình; không đưa thông tin đăng nhập thật vào Git.

Không cần upload các mục phục vụ phát triển và tài liệu: `.git/`, `.vscode/`, `docs/`, `tools/`, `.DS_Store` hoặc `backup-legacy/`.

## Bố cục repo

- `index.html`: landing page
- `assets/`: CSS, JavaScript, hình ảnh và tài nguyên website
- `demos/`: các trang demo được website nhúng hoặc liên kết
- `api/`: endpoint PHP tùy chọn và cấu hình mẫu
- `docs/`: tài liệu vận hành và triển khai
- `tools/`: script đồng bộ Google Sheets và trợ lý Max Girl chạy cục bộ
