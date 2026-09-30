# Express E-Commerce Backend (NestJS Architecture Concept) — Lộ trình Triển khai

Dự án này là bản chuyển đổi (rewrite) từ NestJS sang Node.js + Express + TypeScript, giữ nguyên cấu trúc Module (Controllers, Services, Routes) và kiến trúc tổng thể nhằm mục đích hiểu sâu cách hoạt động bên dưới của framework.

---

## Phase 1: Setup & Core (Express Server, Middlewares, TypeORM)
- [x] Khởi tạo dự án (`npm init`), cài đặt Express, TypeScript, tsx, dotenv, helmet, cors.
- [x] Thiết lập cấu trúc thư mục chuẩn: `src/core`, `src/modules`, `src/config`.
- [x] Viết `app.ts` (như AppModule) và `server.ts` (như main.ts).
- [x] Cấu hình biến môi trường (`dotenv`) và Global Error Handler (như Exception Filter).
- [x] Setup Docker Compose (Postgres, Redis).
- [x] Khởi tạo TypeORM, cấu hình `data-source.ts`, kết nối Database thành công.

## Phase 2: Auth Module (JWT, Password Hashing, Guards)
- [x] Tạo entity `User` (`User.entity.ts`).
- [x] Tạo `AuthModule`: `auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`.
- [x] Đăng ký (Hash password với bcrypt), Đăng nhập (tạo Access & Refresh Token).
- [x] Lưu Refresh Token.
- [x] Viết Middleware xác thực (tương đương `JwtAuthGuard`) và phân quyền (tương đương `RolesGuard`).

## Phase 3: Category & Product Module
- [ ] Xây dựng `CategoryModule` (CRUD danh mục).
- [ ] Xây dựng `ProductModule` (CRUD sản phẩm, phân trang, lọc, tìm kiếm).
- [ ] Xây dựng `UploadModule`: Xử lý upload ảnh bằng Multer.

## Phase 4: Cart & Order Module (Trọng tâm)
- [ ] Xây dựng `CartModule`: Quản lý giỏ hàng.
- [ ] Xây dựng `OrderModule`: Tạo đơn hàng từ giỏ.
- [ ] **Transaction**: Dùng `QueryRunner` của TypeORM để an toàn trừ kho, tránh race condition.
- [ ] Hủy đơn hàng và hoàn lại số lượng tồn kho.

## Phase 5: Background Jobs & Thanh toán
- [ ] Tích hợp BullMQ với Redis.
- [ ] Background job gửi Email đơn hàng thành công.
- [ ] Delayed Job: Hủy đơn nếu sau X phút chưa thanh toán.
- [ ] Tích hợp cổng thanh toán Sandbox (Stripe/VNPay).

## Phase 6: Hoàn thiện & Vận hành
- [ ] Xây dựng Route `/health` (Healthcheck).
- [ ] Cấu hình Logger có cấu trúc (Winston hoặc Pino).
- [ ] Chuẩn hóa Response toàn hệ thống (tương đương `TransformResponseInterceptor`).
- [ ] Hoàn thiện README và seed dữ liệu.
