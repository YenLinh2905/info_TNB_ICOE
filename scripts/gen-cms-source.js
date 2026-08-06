// Generates an inline-styled HTML blob matching the format of the
// icoe.org.vn CMS "Source" editor field, built directly from this repo's
// current _data/*.json — so it can be pasted wholesale into that CMS's
// content textarea to update the page without needing an iframe.
//
// Styling is baked in via inline `style="..."` attributes only (colors,
// borders, radius, shadow lifted from src/styles/icoe-center.css's design
// tokens) because the target CMS field has no access to our stylesheet or
// CSS classes - only inline styles survive being pasted into a bare
// textarea. `:hover` transitions from the real site can't be replicated
// this way (CSS pseudo-classes don't exist as inline styles, and a
// `<style>` block risks being stripped by the CMS's own sanitizer on
// save), so this intentionally reproduces the *static* look only.
//
// Every image box uses a FIXED width/height + object-fit:cover (rather
// than height:auto) so cards in the same row line up evenly regardless of
// each source photo's native aspect ratio - mixing landscape/portrait/
// square photos with auto-height previously produced ragged card rows.
//
// Two variants are produced from the same builder:
//   - noi-dung-cms-source.html      : <img src="UPLOAD_ME/filename">
//     placeholders, meant to be pasted into the CMS Source field; images
//     have to be re-uploaded there since the CMS can't reach this repo.
//   - noi-dung-cms-source copy.html : <img src="src/images/...">
//     real repo-relative paths, meant for opening directly in a browser
//     from the project root to preview the layout with working images.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'src/_data');

function loadJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
}

const site = loadJson('site.json');
const team = loadJson('team.json');
const organization = loadJson('organization.json');
const equipment = loadJson('equipment.json');
const projectTables = loadJson('projectTables.json');
const featuredProducts = loadJson('featuredProducts.json');
const publications = loadJson('publications.json');
const researchGallery = loadJson('researchGallery.json');
const activityGallery = loadJson('activityGallery.json');

// ---- Design tokens (lifted from src/styles/icoe-center.css) ----
const ACCENT = '#0b4f7a';
const ACCENT_SOFT = '#e8f1f7';
const BORDER = '#dbe7ee';
const CARD_SHADOW = '0 14px 28px rgba(11,79,122,0.08)';
const RADIUS = '12px';

// Full-sentence wording for "Các lĩnh vực nghiên cứu", given verbatim by the
// center (closer to the original icoe.org.vn phrasing than the short
// title/description pairs in researchAreas.json, which exist for the card
// layout on the live 11ty site). Kept as a literal list here rather than
// derived from researchAreas.json since the two are intentionally different
// wording for different audiences.
const RESEARCH_AREAS_FULL_TEXT = [
  'Nghiên cứu các dạng năng lượng thủy triều, sóng, gió.',
  'Nghiên cứu tài nguyên khoáng sản đáy biển, nguồn lợi thủy hải sản và các loại sinh vật khác vùng biển và đới bờ.',
  'Nghiên cứu và chuyển giao công nghệ mô hình nuôi trồng thủy hải sản vùng cửa sông - ven biển, biển và hải đảo.',
  'Nghiên cứu tài nguyên thiên nhiên rừng ngập mặn, dải cát, tiềm năng du lịch dải ven biển, vùng biển và hải đảo.',
  'Nghiên cứu đề xuất giải pháp khoa học công nghệ ứng phó, khắc phục, bảo vệ, phục hồi và tái tạo hệ sinh thái, tài nguyên thiên nhiên và nguồn lợi thủy hải sản.',
  'Nghiên cứu, ứng dụng mô hình thực địa, mô hình vật lý, mô hình số trị, trí tuệ nhân tạo, viễn thám và hệ thống thông tin địa lý phục vụ lĩnh vực tài nguyên thiên nhiên vùng biển và đới bờ.',
  'Nghiên cứu cơ chế chính sách phát triển bến cảng, khu neo đậu, tránh bão tàu thuyền, nuôi trồng thủy hải sản, khai thác khoảng sản, du lịch, rừng ngập mặn, các nguồn lợi khác từ biển, ... phục vụ khai thác sử dụng bền vững tài nguyên biển và đới bờ.',
  'Nghiên cứu thiết kế công trình, ứng dụng vật liệu mới và chuyển giao công nghệ tạo nguồn, trữ nước, cấp nước.',
  'Nghiên cứu phát triển và ứng dụng công nghệ số, tự động hoá trong quan trắc, dự báo và cảnh báo sớm về thiên tai, quản lý tài nguyên thiên nhiên biển và đới bờ.',
  'Tham gia hướng dẫn luận văn Đại học, Sau đại học về lĩnh vực khai thác tài nguyên biển và các vấn đề kỹ thuật có liên quan.',
];

// "Giới thiệu chung" copy, given verbatim.
const INTRO_PARAGRAPHS = [
  'Tiền thân là Trung tâm Nghiên cứu Khai thác Tài nguyên Biển & Đới bờ (thành lập năm 2008 theo Quyết định số 2863/QĐ-BNN-TCCB ngày 18/9/2008 của Bộ NN&PTNT), Trung tâm Tài nguyên Biển và Quản lý Rủi ro Thiên tai chính thức mang tên gọi mới theo Quyết định số 1916/QĐ-BNNMT ngày 25/05/2026 của Bộ Nông nghiệp và Môi trường, trực thuộc Viện Kỹ thuật Biển – Viện Khoa học Thủy lợi Việt Nam.',
  'Kế thừa bề dày kinh nghiệm, Trung tâm tự hào là đơn vị nòng cốt chuyên thực hiện nghiên cứu khoa học, cung cấp dịch vụ tư vấn và chuyển giao công nghệ trong lĩnh vực tài nguyên biển và đới bờ. Chúng tôi không ngừng phát triển thông qua các công trình nghiên cứu chuyên sâu, chương trình đào tạo và mạng lưới hợp tác rộng khắp trong nước cũng như quốc tế.',
];

// Date prefix the CMS applies to uploaded files (matches its own
// YYYYMMDD-original-filename.ext convention observed on icoe.org.vn).
const CMS_UPLOAD_DATE_PREFIX = '20260803';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sectionHeading(text) {
  return `<p style="text-align:center;margin:36px 0 18px;"><span style="display:inline-block;color:${ACCENT};font-size:20px;font-weight:800;letter-spacing:0.02em;border-bottom:3px solid ${ACCENT};padding-bottom:6px;">${esc(text)}</span></p>`;
}

function cardOpen(extra = '') {
  return `background:#fff;border:1px solid ${BORDER};border-radius:${RADIUS};box-shadow:${CARD_SHADOW};padding:16px;${extra}`;
}

// mode: 'placeholder' -> src="UPLOAD_ME/filename.jpg" (paste into CMS, then
//        re-upload each image and swap the src by hand)
//       'real'        -> src="src/images/....jpg" (repo-relative, works
//        when this file is opened straight from the project root)
function buildHtml(mode) {
  function imgSrc(localSrc) {
    if (mode === 'real') return `src/${localSrc}`;
    const dashedName = path.basename(localSrc).replace(/_/g, '-');
    return `/docs/images/${CMS_UPLOAD_DATE_PREFIX}-${dashedName}`;
  }

  // width/height are a *fixed box* - object-fit:cover crops to fill it so
  // every card in a row ends up the same height no matter the source
  // photo's aspect ratio.
  function imgTag(localSrc, alt, { width, height, extraStyle = '' } = {}) {
    const style = `display:block;width:${width};height:${height};object-fit:cover;border-radius:${RADIUS};${extraStyle}`;
    return `<img alt="${esc(alt)}" src="${imgSrc(localSrc)}" style="${style}" />`;
  }

  let out = [];

  // ---- Title block ----
  out.push(
    `<p style="text-align: center;">${imgTag('images/banner.jpg', site.title, { width: '100%', height: '260px', extraStyle: 'max-width:800px;margin:0 auto;' })}</p>`,
  );
  out.push(
    `<p style="text-align:center;margin-top:20px;"><span style="color:${ACCENT};font-size:22px;font-weight:800;">${esc(site.jsonLd.name.toUpperCase())}</span></p>`,
  );
  out.push(
    `<p style="text-align:center;margin-top:4px;"><span style="color:${ACCENT};font-size:15px;font-weight:600;letter-spacing:0.04em;">${esc(site.jsonLd.alternateName.toUpperCase())}</span></p>`,
  );

  // ---- Giới thiệu chung ----
  for (const paragraph of INTRO_PARAGRAPHS) {
    out.push(
      `<p style="margin:0 0 14px;color:#33424f;line-height:1.7;text-align:justify;">${esc(paragraph)}</p>`,
    );
  }

  // ---- Research areas (numbered cards, verbatim full-sentence wording) ----
  out.push(sectionHeading('CÁC LĨNH VỰC NGHIÊN CỨU'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < RESEARCH_AREAS_FULL_TEXT.length; i += 2) {
    const pair = [RESEARCH_AREAS_FULL_TEXT[i], RESEARCH_AREAS_FULL_TEXT[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    pair.forEach((sentence, j) => {
      const num = i + j + 1;
      out.push(
        [
          `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen(`border-left:4px solid ${ACCENT};`)}">`,
          `\t\t\t<table style="width:100%;border-collapse:collapse;"><tbody><tr>`,
          `\t\t\t<td style="width:36px;vertical-align:top;padding:0 12px 0 0;"><span style="display:inline-block;width:28px;height:28px;line-height:28px;text-align:center;border-radius:50%;background:${ACCENT};color:#fff;font-weight:800;font-size:13px;">${num}</span></td>`,
          `\t\t\t<td style="vertical-align:top;"><p style="margin:0;color:#33424f;font-size:14px;line-height:1.6;">${esc(sentence)}</p></td>`,
          `\t\t\t</tr></tbody></table>`,
          `\t\t\t</td>`,
        ].join('\n'),
      );
    });
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Organization ----
  out.push(sectionHeading('CƠ CẤU TỔ CHỨC'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);

  for (let i = 0; i < organization.length; i += 2) {
    const pair = [organization[i], organization[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    for (const o of pair) {
      const descLine = o.description
        ? `\n\t\t\t<p style="margin:0;color:#4a5a67;font-size:14px;">${esc(o.description)}</p>`
        : '';
      out.push(
        `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen(`border-left:4px solid ${ACCENT};`)}">\n\t\t\t<p style="margin:0;color:${ACCENT};font-weight:700;">${esc(o.title)}</p>${descLine}\n\t\t\t</td>`,
      );
    }
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Team (card grid, 2 per row, fixed square avatar) ----
  out.push(sectionHeading('ĐỘI NGŨ CÁN BỘ KHOA HỌC'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < team.length; i += 2) {
    const pair = [team[i], team[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    for (const p of pair) {
      const emails = p.emails
        .map((e) => `Email: <a href="mailto:${esc(e)}" style="color:${ACCENT};">${esc(e)}</a>`)
        .join('<br />');
      const photoCell = p.avatar
        ? `\t\t\t${imgTag(p.avatar, p.name, { width: '120px', height: '160px', extraStyle: `border:3px solid ${ACCENT_SOFT};` })}`
        : `\t\t\t<span style="display:block;width:120px;height:160px;line-height:160px;text-align:center;border-radius:${RADIUS};background:${ACCENT_SOFT};color:${ACCENT};font-weight:800;font-size:24px;">${esc(p.initials || '')}</span>`;
      out.push(
        [
          `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen()}">`,
          `\t\t\t<table style="width:100%;border-collapse:collapse;"><tbody><tr>`,
          `\t\t\t<td style="width:120px;vertical-align:top;padding:0 14px 0 0;">${photoCell}</td>`,
          `\t\t\t<td style="vertical-align:top;">`,
          `\t\t\t<p style="margin:0 0 2px;color:${ACCENT};font-weight:800;">${esc(p.name)}</p>`,
          `\t\t\t<p style="margin:0 0 6px;color:#33424f;font-size:13px;font-weight:600;">${esc(p.role)}</p>`,
          `\t\t\t<p style="margin:0 0 6px;color:#4a5a67;font-size:13px;">${esc(p.specialty)}</p>`,
          `\t\t\t<p style="margin:0;color:#4a5a67;font-size:13px;">${emails}</p>`,
          `\t\t\t</td>`,
          `\t\t\t</tr></tbody></table>`,
          `\t\t\t</td>`,
        ].join('\n'),
      );
    }
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Equipment (card grid, 3 per row, fixed-height photo) ----
  out.push(sectionHeading('MỘT SỐ CÁC THIẾT BỊ TIÊU BIỂU'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < equipment.length; i += 3) {
    const row = equipment.slice(i, i + 3);
    out.push(`\t\t<tr>`);
    for (const e of row) {
      out.push(
        `\t\t\t<td style="width:33%;vertical-align:top;${cardOpen('text-align:center;')}">\n\t\t\t${imgTag(e.image, e.name, { width: '100%', height: '220px', extraStyle: 'margin:0 auto 8px;' })}\n\t\t\t<p style="margin:0;color:#33424f;font-size:14px;font-weight:600;">${esc(e.name)}</p>\n\t\t\t</td>`,
      );
    }
    for (let j = row.length; j < 3; j++) out.push(`\t\t\t<td style="width:33%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Project tables ----
  out.push(sectionHeading('MỘT SỐ ĐỀ TÀI DỰ ÁN TIÊU BIỂU ĐÃ VÀ ĐANG THỰC HIỆN'));
  for (const table of projectTables) {
    out.push(
      `<p style="color:${ACCENT};font-weight:700;margin:22px 0 8px;">* ${esc(table.title)}:</p>`,
    );
    out.push(
      `<table style="width:100%;border-collapse:collapse;border:1px solid ${BORDER};font-size:13px;">`,
    );
    out.push(`\t<tbody>`);
    out.push(
      `\t\t<tr style="background:${ACCENT};color:#fff;">\n\t\t\t<td style="padding:8px;text-align:center;font-weight:700;width:5%;">STT</td>\n\t\t\t<td style="padding:8px;font-weight:700;">${esc(table.nameLabel)}</td>\n\t\t\t<td style="padding:8px;text-align:center;font-weight:700;width:14%;">${esc(table.levelLabel)}</td>\n\t\t\t<td style="padding:8px;text-align:center;font-weight:700;width:12%;">Năm thực hiện</td>\n\t\t</tr>`,
    );
    table.rows.forEach((r, idx) => {
      const rowBg = idx % 2 === 0 ? '#fff' : ACCENT_SOFT;
      out.push(
        `\t\t<tr style="background:${rowBg};">\n\t\t\t<td style="padding:8px;text-align:center;border-top:1px solid ${BORDER};">${idx + 1}</td>\n\t\t\t<td style="padding:8px;border-top:1px solid ${BORDER};">${esc(r.name)}</td>\n\t\t\t<td style="padding:8px;text-align:center;border-top:1px solid ${BORDER};">${esc(r.level)}</td>\n\t\t\t<td style="padding:8px;text-align:center;border-top:1px solid ${BORDER};">${esc(r.year)}</td>\n\t\t</tr>`,
      );
    });
    out.push(`\t</tbody>`);
    out.push(`</table>`);
  }

  // ---- Featured products ----
  out.push(sectionHeading('SẢN PHẨM KHCN NỔI BẬT'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < featuredProducts.length; i += 2) {
    const pair = [featuredProducts[i], featuredProducts[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    for (const item of pair) {
      const paragraphs = item.paragraphs
        .map(
          (p) =>
            `<p style="margin:0 0 10px;color:#33424f;font-size:15px;line-height:1.7;text-align:justify;">${esc(p)}</p>`,
        )
        .join('\n\t\t\t');
      const links = [
        `<a href="${esc(item.link)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${ACCENT};color:#fff;font-weight:700;font-size:15px;padding:9px 16px;border-radius:999px;text-decoration:none;margin:4px 8px 0 0;">Truy cập ${esc(item.linkLabel)}</a>`,
      ];
      if (item.secondaryLink) {
        links.push(
          `<a href="${esc(item.secondaryLink)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${ACCENT_SOFT};color:${ACCENT};font-weight:700;font-size:15px;padding:9px 16px;border-radius:999px;text-decoration:none;margin:4px 0 0;">${esc(item.secondaryLinkLabel)}</a>`,
        );
      }
      const thumb = item.image
        ? `\t\t\t${imgTag(item.image, item.title, { width: 'calc(100% + 32px)', height: '330px', extraStyle: 'border-radius:12px 12px 0 0;margin:-16px -16px 12px;' })}`
        : '';
      out.push(
        `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen()}">\n\t\t\t${thumb}\n\t\t\t<p style="margin:0 0 10px;color:${ACCENT};font-weight:700;font-size:15px;">${esc(item.title)}</p>\n\t\t\t${paragraphs}\n\t\t\t${links.join('\n\t\t\t')}\n\t\t\t</td>`,
      );
    }
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Publications ----
  out.push(sectionHeading(publications.title.toUpperCase()));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:0 8px;">`);
  out.push(`\t<tbody>`);
  publications.rows.forEach((p, idx) => {
    out.push(
      `\t\t<tr>\n\t\t\t<td style="${cardOpen(`border-left:4px solid ${ACCENT};padding:12px 16px;`)}">\n\t\t\t<span style="color:${ACCENT};font-weight:700;">${idx + 1}.</span> <span style="color:#1f2d36;">${esc(p.title)}</span> <span style="color:#6b7a86;font-style:italic;">${esc(p.source)}.</span> <span style="color:#6b7a86;">Năm ${esc(p.year)}.</span>\n\t\t\t</td>\n\t\t</tr>`,
    );
  });
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Research gallery (card grid, 2 per row, fixed-height photo) ----
  out.push(sectionHeading('MỘT SỐ HÌNH ẢNH KẾT QUẢ NGHIÊN CỨU'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < researchGallery.length; i += 2) {
    const pair = [researchGallery[i], researchGallery[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    for (const g of pair) {
      out.push(
        `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen('text-align:center;')}">\n\t\t\t${imgTag(g.src, g.alt, { width: '100%', height: '220px', extraStyle: 'margin:0 auto 8px;' })}\n\t\t\t<p style="margin:0;color:#4a5a67;font-size:13px;font-style:italic;">${esc(g.caption)}</p>\n\t\t\t</td>`,
      );
    }
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Activity gallery (card grid, 2 per row, fixed-height photo) ----
  out.push(sectionHeading('MỘT SỐ HÌNH ẢNH HOẠT ĐỘNG CỦA TRUNG TÂM TRONG NƯỚC VÀ HỢP TÁC QUỐC TẾ'));
  out.push(`<table style="width:100%;border-collapse:separate;border-spacing:10px;">`);
  out.push(`\t<tbody>`);
  for (let i = 0; i < activityGallery.length; i += 2) {
    const pair = [activityGallery[i], activityGallery[i + 1]].filter(Boolean);
    out.push(`\t\t<tr>`);
    for (const g of pair) {
      out.push(
        `\t\t\t<td style="width:50%;vertical-align:top;${cardOpen('text-align:center;')}">\n\t\t\t${imgTag(g.src, g.alt, { width: '100%', height: '220px', extraStyle: 'margin:0 auto 8px;' })}\n\t\t\t<p style="margin:0;color:#4a5a67;font-size:13px;">${esc(g.caption)}</p>\n\t\t\t</td>`,
      );
    }
    if (pair.length === 1) out.push(`\t\t\t<td style="width:50%;"></td>`);
    out.push(`\t\t</tr>`);
  }
  out.push(`\t</tbody>`);
  out.push(`</table>`);

  // ---- Closing banner (same photo used at the top of the page) ----
  out.push(
    `<p style="text-align: center;margin-top:32px;">${imgTag('images/banner-footer.jpg', site.title, { width: '100%', height: 'auto', extraStyle: 'margin:0 auto;border-radius:0;' })}</p>`,
  );

  return out.join('\n\n');
}

const placeholderHtml = buildHtml('placeholder');
const realHtml = buildHtml('real');

fs.writeFileSync(path.join(root, 'noi-dung-cms-source.html'), placeholderHtml, 'utf8');
fs.writeFileSync(path.join(root, 'noi-dung-cms-source-local.html'), realHtml, 'utf8');

console.log('Written noi-dung-cms-source.html (placeholders):', placeholderHtml.length, 'chars');
console.log('Written noi-dung-cms-source-local.html (real local paths):', realHtml.length, 'chars');
