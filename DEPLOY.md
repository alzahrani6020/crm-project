# دليل نشر CRM + المحاسبة على الإنترنت 🚀

> **آخر تحديث:** 2026-05-16

---

## 📋 المتطلبات

ستحتاج إلى:
1. حساب GitHub (جاهز ✅)
2. حساب على منصة استضافة (مجانية)
3. قاعدة بيانات PostgreSQL (مجانية)

---

## الخطوة 1: قاعدة البيانات (Supabase - مجاني)

### 1.1 إنشاء حساب
- اذهب إلى: https://supabase.com
- سجل الدخول بحساب GitHub
- اضغط **"New Project"**
- اختر اسم: `crm-db`
- اضغط **"Create"**

### 1.2 الحصول على Database URL
1. اذهب إلى **Settings** ← **Database**
2. انسخ **Connection String** URI
3. يبدو هكذا:
```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 1.3 تطبيق Prisma Migration
```bash
# في جهازك المحلي
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
cd packages/database
npx prisma migrate deploy
npx ts-node prisma/seed.ts
```

---

## الخطوة 2: نشر الـ Backend API (Render - مجاني)

### 2.1 إنشاء حساب
- https://render.com
- سجل الدخول بحساب GitHub

### 2.2 إنشاء Web Service
1. اضغط **"New +"** ← **"Web Service"**
2. اربط بـ GitHub repo: `alzahrani6020/crm-project`
3. اضبط الإعدادات:

| الإعداد | القيمة |
|---------|--------|
| Name | `crm-api` |
| Region | Frankfurt (EU) |
| Branch | `main` |
| Root Directory | `apps/api` |
| Runtime | `Node` |
| Build Command | `npm install && cd ../../packages/database && npx prisma generate && cd ../../apps/api && npx nest build` |
| Start Command | `node dist/main.js` |
| Plan | `Free` |

4. في **Environment Variables** أضف:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
```

5. اضغط **"Create Web Service"**

### 2.3 الرابط
بعد 5 دقائق، ستحصل على رابط مثل:
```
https://crm-api-xxxx.onrender.com
```

**اختبار:**
```
https://crm-api-xxxx.onrender.com/api/docs
```

---

## الخطوة 3: نشر الـ Admin (Vercel - مجاني)

### 3.1 إنشاء حساب
- https://vercel.com
- سجل الدخول بحساب GitHub

### 3.2 إضافة مشروع جديد
1. اضغط **"Add New Project"**
2. اختر repo: `alzahrani6020/crm-project`
3. اضغط **"Import"**

### 3.3 إعدادات البناء
| الإعداد | القيمة |
|---------|--------|
| Framework Preset | Next.js |
| Root Directory | `apps/admin` |
| Build Command | `cd ../../packages/database && npx prisma generate && cd ../../apps/admin && next build` |
| Output Directory | `.next` |

### 3.4 متغيرات البيئة
في **Environment Variables** أضف:
```
NEXT_PUBLIC_API_URL=https://crm-api-xxxx.onrender.com/api
```

> **ملاحظة:** غير `NEXT_PUBLIC_API_URL` في الكود:
> - افتح `apps/admin/src/app/*/page.tsx`
> - استبدل `http://localhost:3001/api` بـ `process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'`

### 3.5 الرابط
بعد البناء، ستحصل على:
```
https://crm-admin-xxx.vercel.app
```

---

## الخطوة 4: نشر الـ Web (Vercel - اختياري)

نفس خطوات Admin لكن:
- **Root Directory:** `apps/web`
- **NEXT_PUBLIC_API_URL:** نفس رابط API

---

## 🔄 التحديثات المستقبلية

عندما تعدل الكود محلياً:
```bash
git add .
git commit -m "وصف التعديل"
git push origin main
```

**سيتم التحديث تلقائياً** على Render و Vercel!

---

## ⚠️ ملاحظات مهمة

### Render (مجاني)
- يدخل في "Sleep" بعد 15 دقيقة من عدم الاستخدام
- أول طلب بعد Sleep يستغرق 30-60 ثانية
- **الحل:** استخدم https://uptimerobot.com لإرسال ping كل 5 دقائق

### Supabase (مجاني)
- 500MB مساحة
- تتوقف بعد 7 أيام من عدم النشاط
- **الحل:** قم بزيارة لوحة التحكم أسبوعياً

### Vercel (مجاني)
- 100GB bandwidth/شهر
- بناء سريع (30 ثانية)
- لا يوجد sleep

---

## 🛠️ بديل: Railway (أسهل)

https://railway.app

1. New Project ← Deploy from GitHub repo
2. اختر `alzahrani6020/crm-project`
3. Railway يكتشف `Dockerfile` تلقائياً!
4. أضف `DATABASE_URL` في Variables
5. انشر!

---

## 📞 دعم

| المنصة | الرابط |
|--------|--------|
| Render Docs | https://render.com/docs |
| Vercel Docs | https://vercel.com/docs |
| Supabase Docs | https://supabase.com/docs |
| Railway Docs | https://docs.railway.app |

---

## ✅ قائمة التحقق قبل النشر

- [ ] قاعدة بيانات PostgreSQL جاهزة
- [ ] `prisma migrate deploy` تم بنجاح
- [ ] Seed data تم تطبيقها
- [ ] Backend يعمل على Render
- [ ] Admin يعمل على Vercel
- [ ] `NEXT_PUBLIC_API_URL` يشير للـ Backend الصحيح
- [ ] تسجيل الدخول يعمل
- [ ] Dashboard يعرض البيانات

**🎉 بعد إتمام هذه الخطوات، سيكون CRM + المحاسبة متاحاً على الإنترنت!**
