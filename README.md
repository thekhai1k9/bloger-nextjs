# 🚀 KP Management - Modern Blog CMS Platform

KP Management là một hệ thống quản trị nội dung (CMS) và biên soạn Blog chuyên nghiệp, đơn giản, hiện đại cùng hiệu năng tối ưu. Dự án được phát triển dựa trên nền tảng Next.js App Router kết hợp đồng bộ dữ liệu thời gian thực với Supabase.

[![Next.js Version](https://img.shields.io/badge/next.js-v14.1.0-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-blue?logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Tính Năng Nổi Bật (Key Features)

* **🔐 Authentication & Role-based Authorization:** Cơ chế bảo mật phân quyền tầng Server & Client (Admin / User), bảo vệ nghiêm ngặt các tuyến đường dẫn quản trị hệ thống.
* **📝 Dynamic Content Authoring:** Hỗ trợ biên soạn nội dung, tự động chuyển đổi tiêu đề thành cấu trúc URL (Slug) chuẩn SEO.
* **📂 Advanced Asset Management:** Tải lên hình ảnh ảnh bìa (Cover Image) trực tiếp lên Supabase Storage với cơ chế kiểm soát tiến trình.
* **📊 Smart Data Table:** Hệ thống bảng hiển thị danh sách bài viết trực quan, hỗ trợ tìm kiếm cục bộ (Local Search Filter) và phân trang tự động (Client-side Pagination) mượt mà.
* **🎨 Custom UI Components:** Toàn bộ hệ thống Modal xác nhận, Button điều khiển trạng thái (Loading state), Input đều được custom độc quyền, loại bỏ hoàn toàn các pop-up mặc định phèn của trình duyệt.
* **🎬 Fluid Animations:** Trải nghiệm chuyển trang mượt mà nhờ tích hợp Framer Motion / Custom Transition Effect.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

* **Core Framework:** Next.js (App Router)
* **Database & BaaS:** Supabase (PostgreSQL, Supabase Auth, Storage)
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Feedback:** React Hot Toast (Thông báo trạng thái real-time)

---

## 📁 Cấu Trúc Thư Mục Chính (Architecture)

Dự án tuân thủ nghiêm ngặt mô hình Separation of Concerns (SoC) giúp bóc tách mã nguồn độc lập giữa giao diện và logic xử lý:

```text
src/
├── app/
│   └── admin/                  # Phân hệ quản trị (Admin Dashboard)
│       ├── _components/        # Các UI component đặc thù của Admin
│       ├── _hooks/             # useAdminLogic để bóc tách toàn bộ logic xử lý data
│       ├── edit-post/[id]/     # Dynamic Route xử lý chỉnh sửa bài viết
│       ├── new-post/           # Form biên soạn bài viết mới
│       └── page.tsx            # Trang tổng quan danh sách quản lý bài viết
├── components/
│   └── ui/                     # Bộ thư viện UI dùng chung (Modal, ButtonSubmit,...)
├── helpers/
│   └── utils.ts                # Các hàm bổ trợ (generateSlug, format Date,...)
└── lib/
    └── supabase/               # Cấu hình kết nối Supabase Client/Server