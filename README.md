# Website ICOE — Trung tâm Tài nguyên Biển và Quản lý Rủi ro Thiên tai

Website tĩnh giới thiệu Trung tâm Tài nguyên Biển và Quản lý Rủi ro Thiên tai (ICOE), xây dựng bằng **[Eleventy (11ty)](https://www.11ty.dev/)** và deploy dưới dạng site tĩnh qua **GitHub Pages**.

Trang chỉ có **một trang duy nhất** (single-page), gồm các mục: Giới thiệu, Lĩnh vực nghiên cứu, Cơ cấu tổ chức, Đội ngũ, Thiết bị, Đề tài/Dự án, Công bố khoa học, và 2 thư viện ảnh (kết quả nghiên cứu / hoạt động).

---

## 1. Kiến trúc dự án

Trước đây trang là **1 file `index.html` viết tay** (>1000 dòng) nhúng cứng toàn bộ dữ liệu (đội ngũ, đề tài, công bố, ảnh...). Trang đã được refactor sang kiến trúc **Eleventy**: dữ liệu tách thành JSON, giao diện tách thành template tái sử dụng, ảnh được tối ưu tự động lúc build, build ra HTML tĩnh **giữ nguyên 100% nội dung và hành vi** của bản cũ.

```
.
├── .eleventy.js               # Cấu hình Eleventy + shortcode {% image %} tối ưu ảnh
├── eslint.config.js           # Lint JavaScript
├── .stylelintrc.json          # Lint CSS
├── .prettierrc.json           # Format JS/JSON/Markdown
├── .husky/pre-commit          # Chạy lint-staged trước mỗi commit
├── .github/workflows/
│   ├── ci.yml                  # Lint + build check trên mọi push/PR
│   └── deploy.yml               # Build + deploy GitHub Pages tự động
├── package.json
├── src/                        # TOÀN BỘ mã nguồn — đây là nơi cần sửa khi cập nhật nội dung
│   ├── index.njk                 # Trang chủ — lắp ráp các section theo đúng thứ tự hiển thị
│   ├── _layouts/
│   │   └── base.njk               # Khung <html>/<head>/<body> dùng chung, skip-link
│   ├── _includes/                 # Từng section là 1 partial độc lập
│   │   ├── header.njk
│   │   ├── footer.njk
│   │   ├── back-to-top.njk
│   │   ├── hero.njk
│   │   ├── intro.njk
│   │   ├── research-areas.njk
│   │   ├── organization.njk
│   │   ├── team.njk
│   │   ├── equipment.njk
│   │   ├── projects.njk
│   │   ├── publications.njk
│   │   ├── research-gallery.njk
│   │   ├── activity-gallery.njk
│   │   └── lightbox-dialog.njk
│   ├── _data/                     # DỮ LIỆU — sửa nội dung ở đây, KHÔNG sửa trong .njk
│   │   ├── site.json               # Tiêu đề, mô tả, Open Graph...
│   │   ├── jsonLd.js                # Dữ liệu structured data (schema.org)
│   │   ├── researchAreas.json      # 10 lĩnh vực nghiên cứu
│   │   ├── organization.json       # Cơ cấu tổ chức
│   │   ├── team.json               # Đội ngũ cán bộ (ảnh, chức danh, email...)
│   │   ├── equipment.json          # Thiết bị & công nghệ
│   │   ├── projectTables.json      # 3 bảng đề tài/dự án
│   │   ├── publications.json       # Bảng công bố khoa học
│   │   ├── researchGallery.json    # Ảnh kết quả nghiên cứu (thư mục thanh_tuu)
│   │   └── activityGallery.json    # Ảnh hoạt động (thư mục hoat_dong)
│   ├── styles/icoe-center.css     # CSS gốc, giữ nguyên toàn bộ nội dung + responsive
│   ├── scripts/
│   │   ├── lightbox.js             # Xử lý phóng to ảnh (tách từ <script> inline cũ)
│   │   └── nav.js                  # Menu, active-link, nút về đầu trang
│   ├── images/                    # Ảnh gốc (banner, đội ngũ, thiết bị, gallery...)
│   └── public/                    # File copy thẳng ra gốc site: favicon, manifest,
│                                   # robots.txt, og-image, font, 2 file PDF quyết định thành lập
└── _site/                      # OUTPUT build — KHÔNG sửa tay, không commit (đã .gitignore)
```

**Vì sao có `src/public/`?** Đây là nơi chứa các file cần nằm ở **gốc** của site khi deploy (ví dụ `favicon.svg`, `site.webmanifest`, font tự host, 2 file PDF quyết định thành lập được link trực tiếp từ mục Giới thiệu). Eleventy copy nguyên trạng thư mục này ra gốc `_site/`.

**Vì sao đường dẫn ảnh/CSS vẫn là `styles/...`, `images/...` (không có dấu `/` ở đầu)?** Toàn bộ liên kết nội bộ dùng **đường dẫn tương đối**, không dùng đường dẫn tuyệt đối bắt đầu bằng `/`. Nhờ vậy site chạy đúng dù deploy ở domain gốc (`https://<user>.github.io/`) hay ở subpath của một *project page* (`https://<user>.github.io/<repo>/`) mà **không cần cấu hình `pathPrefix`** — đúng tinh thần "code thuần", ít cấu hình.

**Ảnh trong `team`/`equipment`/2 gallery không được copy thẳng nữa** — chúng đi qua shortcode `{% image %}` (định nghĩa trong `.eleventy.js`), tự động sinh AVIF/WebP/JPEG ở nhiều kích thước lúc build (xem mục 8).

---

## 2. Yêu cầu hệ thống

- **Node.js** >= 18 (khuyến nghị dùng bản LTS mới nhất). Kiểm tra: `node -v`
- **npm** (đi kèm Node.js). Kiểm tra: `npm -v`

Không cần cài Eleventy toàn cục — dự án dùng Eleventy cài cục bộ qua `npm install`.

---

## 3. Chạy local từ đầu (clone project mới)

```bash
# 1. Clone repository
git clone <URL-repo-cua-ban>
cd <ten-thu-muc-repo>

# 2. Cài dependencies
npm install

# 3. Chạy dev server (có live reload)
npm run dev
```

Sau bước 3, terminal sẽ hiện địa chỉ local, mặc định:

```
http://localhost:8080
```

Mở địa chỉ này trên trình duyệt — mọi thay đổi trong `src/` (kể cả sửa file JSON) sẽ tự động rebuild và reload trang.

Dừng dev server bằng `Ctrl + C`.

> **Lưu ý**: `npm install` cũng tự động thiết lập Git hook pre-commit (qua `husky`, script `prepare`) — xem mục 9.

---

## 4. Build production

```bash
npm run build
```

Lệnh này chạy `eleventy`, build toàn bộ site tĩnh ra thư mục **`_site/`**. Đây chính là thư mục cần deploy — mở `_site/index.html` bằng trình duyệt (hoặc dùng bất kỳ static file server nào) để xem trước kết quả build production.

Lần build đầu tiên (hoặc sau khi xoá `_site/`) sẽ **chậm hơn** (khoảng 20-25 giây) vì phải xử lý lại toàn bộ ảnh (resize + chuyển AVIF/WebP/JPEG). Các lần build sau, nếu `_site/` còn giữ ảnh đã xử lý, sẽ **rất nhanh** (dưới 1 giây) vì Eleventy bỏ qua ảnh đã tồn tại.

Muốn xoá build cũ trước khi build lại:

```bash
npm run clean && npm run build
```

---

## 5. Cập nhật nội dung (không cần biết lập trình HTML)

| Muốn sửa... | Sửa file |
|---|---|
| Thêm/sửa thành viên đội ngũ | `src/_data/team.json` |
| Thêm/sửa đề tài, dự án | `src/_data/projectTables.json` |
| Thêm/sửa công bố khoa học | `src/_data/publications.json` |
| Thêm/sửa thiết bị | `src/_data/equipment.json` |
| Thêm/sửa lĩnh vực nghiên cứu | `src/_data/researchAreas.json` |
| Thêm ảnh vào thư viện "kết quả nghiên cứu" | `src/_data/researchGallery.json` (và thêm file ảnh vào `src/images/thanh_tuu/`) |
| Thêm ảnh vào thư viện "hoạt động" | `src/_data/activityGallery.json` (và thêm file ảnh vào `src/images/hoat_dong/`) |
| Đổi tiêu đề trang, mô tả SEO | `src/_data/site.json` |

Sau khi sửa file JSON, chạy lại `npm run dev` (hoặc `npm run build`) để thấy thay đổi — **không cần sửa file `.njk`** cho các thay đổi nội dung thông thường.

---

## 6. Deploy lên GitHub Pages

Có 2 cách — chọn **một trong hai**, không cần làm cả hai.

### Cách A — GitHub Actions (khuyến nghị)

Tự động build & deploy mỗi khi push lên nhánh `main`. Workflow đã có sẵn tại [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Thiết lập một lần:**

1. Push repository lên GitHub (nếu chưa có remote):
   ```bash
   git remote add origin <URL-repo-github-cua-ban>
   git push -u origin main
   ```
2. Vào GitHub → repo → **Settings → Pages**.
3. Ở mục **Build and deployment → Source**, chọn **"GitHub Actions"** (không chọn "Deploy from a branch").
4. Push code lên `main` (hoặc vào tab **Actions** → chọn workflow **"Deploy to GitHub Pages"** → **Run workflow** để chạy thủ công lần đầu).
5. Sau khi workflow chạy xong (tab **Actions**), địa chỉ site sẽ hiện ở **Settings → Pages**, dạng `https://<username>.github.io/<repo>/`.

Từ lần sau, **mỗi lần push lên `main` sẽ tự động build và deploy lại** — không cần thao tác gì thêm.

### Cách B — Deploy thư mục build thủ công (nhánh `gh-pages`)

Dùng khi không muốn dùng GitHub Actions (ví dụ deploy từ máy cá nhân).

```bash
npm run deploy
```

Lệnh này (định nghĩa trong `package.json`) sẽ:
1. Chạy `npm run build` → tạo `_site/`
2. Dùng gói [`gh-pages`](https://www.npmjs.com/package/gh-pages) push toàn bộ nội dung `_site/` lên nhánh `gh-pages` của repo hiện tại.

**Thiết lập một lần (sau lần `npm run deploy` đầu tiên):**

1. Vào GitHub → repo → **Settings → Pages**.
2. Ở mục **Build and deployment → Source**, chọn **"Deploy from a branch"**.
3. Chọn **Branch: `gh-pages`**, thư mục **`/ (root)`** → **Save**.
4. Sau vài phút, site sẽ có tại `https://<username>.github.io/<repo>/`.

Từ lần sau, mỗi khi muốn cập nhật site, chỉ cần chạy lại `npm run deploy`.

> **Lưu ý chung cho cả 2 cách:** nếu deploy dưới dạng *project page* (`username.github.io/ten-repo/`, không phải *user page* `username.github.io`), không cần chỉnh sửa gì thêm vì toàn bộ site dùng đường dẫn tương đối (xem mục "Kiến trúc dự án").

---

## 7. Responsive

Container (`.container`, nav, footer) có **max-width tuyệt đối 1100px** ở mọi kích thước màn hình — không mở rộng thêm dù màn hình lớn hơn. Ngoài ra có 3 mức breakpoint theo chiều rộng màn hình:

| Kích thước | Hành vi |
|---|---|
| Desktop (>1100px) | Layout mặc định: 4 cột thiết bị, 3 cột gallery kết quả nghiên cứu, 2 cột gallery hoạt động (container vẫn giữ nguyên 1100px, không rộng hơn) |
| Tablet (761–1100px) | Đội ngũ/Giới thiệu giữ 2 cột, thiết bị chuyển 3 cột |
| Mobile (≤760px) | Mọi lưới về 1 cột |
| Mobile nhỏ (≤480px) | Bảng dữ liệu (đề tài, công bố) chuyển thành danh sách card có nhãn cột, không cần cuộn ngang |

---

## 8. Tối ưu ảnh

Ảnh trong `team`/`equipment`/2 thư viện gallery đi qua shortcode `{% image %}` (định nghĩa trong `.eleventy.js`, dùng [`@11ty/eleventy-img`](https://www.11ty.dev/docs/plugins/image/)):

- Tự sinh 3 định dạng: **AVIF, WebP, JPEG** (trình duyệt tự chọn định dạng nhẹ nhất hỗ trợ được).
- Tự sinh nhiều kích thước (responsive `srcset`), tránh tải ảnh full-size cho ảnh hiển thị nhỏ (ví dụ avatar 112px).
- Tự thêm `width`/`height` thật vào HTML → không bị giật layout (CLS) khi ảnh đang tải.
- Ảnh trong lightbox (phóng to) luôn dùng bản **JPEG lớn nhất** (thuộc tính `data-full`), không phụ thuộc bản nhỏ dùng cho thumbnail.

Muốn thêm ảnh mới vào gallery: chỉ cần thêm file ảnh gốc vào `src/images/...` và khai báo trong file JSON tương ứng (xem mục 5) — không cần tự resize/convert thủ công.

**Font**: chữ Roboto được **tự host** (`src/public/fonts/`), không còn gọi ra `fonts.googleapis.com`. Chỉ giữ 2 bộ ký tự cần thiết (Latin + Vietnamese) dưới dạng variable font (~57KB, phủ hết các độ đậm 100-900).

---

## 9. Lint, format & pre-commit hook

```bash
npm run lint         # ESLint (JS) + Stylelint (CSS)
npm run lint:js      # Chỉ ESLint
npm run lint:css     # Chỉ Stylelint
npm run format       # Prettier --write cho JS/JSON/Markdown
npm run format:check # Kiểm tra format mà không sửa (dùng trong CI)
```

Sau `npm install`, Git hook **pre-commit** tự động được thiết lập (qua `husky`): mỗi lần `git commit`, các file đang staged sẽ tự chạy `eslint --fix`/`stylelint --fix`/`prettier --write` trước khi commit (cấu hình trong `lint-staged` ở `package.json`). Nếu có lỗi lint không tự sửa được, commit sẽ bị chặn cho tới khi sửa xong.

File `.njk` (Nunjucks template) và `src/styles/icoe-center.css` (đã có Stylelint riêng) được loại khỏi phạm vi Prettier — xem `.prettierignore`.

**CI**: mọi push/PR lên `main` đều tự động chạy lint + build qua GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) để bắt lỗi sớm trước khi merge.

---

## 10. Ghi chú kỹ thuật

- **CSS**: `src/styles/icoe-center.css` giữ nguyên nội dung so với bản gốc ở các phase đầu, các thay đổi sau đó (responsive, token, component mới) đều được ghi rõ lý do bằng comment trong chính file CSS.
- **JavaScript**: logic lightbox (phóng to ảnh) được tách từ `<script>` inline cũ ra `src/scripts/lightbox.js`, hành vi không đổi, chỉ nạp qua thẻ `<script src="..." defer>` thay vì inline.
- **Không dùng `pathPrefix`**: xem giải thích ở mục "Kiến trúc dự án" phía trên.
- **Không có bước build phức tạp**: Eleventy v2 chạy trên CommonJS thuần, không yêu cầu ESM, không cần bundler (Webpack/Vite) — đúng định hướng "ưu tiên code thuần".
