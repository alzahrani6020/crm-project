# حالة مشروع CRM + المحاسبة

> **آخر تحديث:** 2026-05-16
> **الحالة:** ✅ المشروع جاهز للتشغيل

---

## 📋 ما تم إنجازه

### البنية التحتية
- [x] Turborepo Monorepo
- [x] Prisma + PostgreSQL
- [x] Docker Compose
- [x] Seed Data (بيانات أولية)
- [x] Git Repo مهيأ

### التطبيقات
| التطبيق | المنفذ | الوصف |
|---------|--------|-------|
| `apps/api` | 3001 | NestJS Backend + Swagger |
| `apps/web` | 3000 | بوابة العملاء (Next.js) |
| `apps/admin` | 3002 | لوحة التحكم + المحاسبة |
| `packages/database` | - | Prisma Schema + Client |

### وحدات CRM
- [x] Auth (JWT) - تسجيل/دخول
- [x] Users - المستخدمين
- [x] Customers - العملاء
- [x] Leads - العملاء المحتملين
- [x] Deals - الصفقات

### وحدات المحاسبة ✅
- [x] Accounts - دليل الحسابات (شجرة هرمية)
- [x] Journal Entries - القيود اليومية (مع التوازن)
- [x] Invoices - الفواتير (ضريبة تلقائية)
- [x] Payments - المدفوعات
- [x] Expenses - المصروفات
- [x] Reports - التقارير المالية:
  - Dashboard Stats
  - Trial Balance (ميزان المراجعة)
  - Profit & Loss (قائمة الدخل)

### ميزات متقدمة
- [x] Prisma Seed (بيانات افتراضية)
- [x] Docker + Docker Compose
- [x] Upload Files (Multer)
- [x] Audit Log (تتبع العمليات)
- [x] Notifications (تذكيرات الفواتير)
- [x] Middleware حماية Routes
- [x] صفحة تسجيل الدخول
- [x] Dashboard مرتبط بالـ APIs

---

## 🚀 طريقة التشغيل

### محلي (بدون Docker)
```bash
# 1. تثبيت
npm install

# 2. إعداد البيئة
cp .env.example .env
# عدل DATABASE_URL

# 3. قاعدة البيانات
cd packages/database
npx prisma migrate dev --name init
npm run db:seed

# 4. تشغيل الكل
npx turbo run dev
```

### بـ Docker
```bash
docker-compose up --build
```

### الروابط
- Admin: http://localhost:3002
- API Docs: http://localhost:3001/api/docs
- Web: http://localhost:3000

### بيانات الدخول
- `admin@crm.com` / `admin123`
- `user@crm.com` / `user123`

---

## 📁 Prisma Models

```
User → Customer, Lead, Deal, Account, JournalEntry, Invoice, Payment, Expense
Customer → Lead[], Deal[], Invoice[]
Invoice → InvoiceItem[], Payment[]
JournalEntry → JournalEntryLine[]
Account → JournalEntryLine[] (debit/credit)
AuditLog
Notification
```

### Enums
- **Role:** USER, ADMIN
- **AccountType:** ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
- **InvoiceStatus:** DRAFT, SENT, PAID, OVERDUE, CANCELLED
- **PaymentMethod:** CASH, BANK_TRANSFER, CREDIT_CARD, CHECK
- **LeadStatus:** NEW, CONTACTED, QUALIFIED, LOST, CONVERTED
- **DealStatus:** PENDING, WON, LOST, CANCELLED

---

## 🔧 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### CRM
- `GET|POST /api/customers`
- `GET|POST /api/leads`
- `GET|POST /api/deals`

### Accounting
- `GET|POST /api/accounts`
- `GET|POST /api/journal-entries`
- `GET|POST /api/invoices`
- `GET|POST /api/payments`
- `GET|POST /api/expenses`

### Reports
- `GET /api/reports/dashboard`
- `GET /api/reports/trial-balance`
- `GET /api/reports/profit-loss`

### System
- `POST /api/upload` - رفع ملف
- `GET /api/audit` - سجل التتبع
- `GET /api/notifications` - الإشعارات

---

## ⚠️ ملاحظات مهمة

1. **الـ Admin Dashboard** يتصل بـ `http://localhost:3001` - تأكد تشغيل API أولاً
2. **الـ Token** يُخزن في `cookies` لمدة أسبوع
3. **رفع الملفات** يحفظ في مجلد `uploads/`
4. **الإشعارات** تُنشأ عبر `POST /api/notifications/check-invoices`

---

## 🔄 المهام المتبقية (إن وجدت)

> *لا يوجد مهام معلقة حالياً*
> *أضف هنا أي مهمة تبدأها لاحقاً*

---

## 💾 Git

```bash
# حفظ التغييرات
git add .
git commit -m "وصف التغيير"

# عرض التاريخ
git log --oneline
```
