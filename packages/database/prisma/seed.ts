import { PrismaClient, AccountType, InvoiceStatus, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'مدير النظام',
      role: 'ADMIN',
    },
  });

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'user@crm.com' },
    update: {},
    create: {
      email: 'user@crm.com',
      password: await bcrypt.hash('user123', 10),
      name: 'موظف المبيعات',
      role: 'USER',
    },
  });

  // Chart of Accounts
  const accounts = [
    { code: '1000', name: 'الأصول', type: AccountType.ASSET, balance: 0 },
    { code: '1100', name: 'النقدية', type: AccountType.ASSET, balance: 50000 },
    { code: '1200', name: 'الذمم المدينة', type: AccountType.ASSET, balance: 15000 },
    { code: '1300', name: 'المخزون', type: AccountType.ASSET, balance: 25000 },
    { code: '2000', name: 'الالتزامات', type: AccountType.LIABILITY, balance: 0 },
    { code: '2100', name: 'الذمم الدائنة', type: AccountType.LIABILITY, balance: 10000 },
    { code: '2200', name: 'القروض', type: AccountType.LIABILITY, balance: 20000 },
    { code: '3000', name: 'حقوق الملكية', type: AccountType.EQUITY, balance: 35000 },
    { code: '3100', name: 'رأس المال', type: AccountType.EQUITY, balance: 35000 },
    { code: '4000', name: 'الإيرادات', type: AccountType.REVENUE, balance: 0 },
    { code: '4100', name: 'مبيعات', type: AccountType.REVENUE, balance: 80000 },
    { code: '5000', name: 'المصروفات', type: AccountType.EXPENSE, balance: 0 },
    { code: '5100', name: 'مصروفات التشغيل', type: AccountType.EXPENSE, balance: 25000 },
    { code: '5200', name: 'المرتبات', type: AccountType.EXPENSE, balance: 15000 },
  ];

  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { code_userId: { code: acc.code, userId: admin.id } },
      update: {},
      create: { ...acc, userId: admin.id },
    });
  }

  // Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'شركة التقنية المتقدمة',
      email: 'info@tech-sa.com',
      phone: '0500000001',
      company: 'شركة التقنية المتقدمة',
      status: 'ACTIVE',
      userId: admin.id,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'مؤسسة الأمل',
      email: 'contact@aml.com',
      phone: '0500000002',
      company: 'مؤسسة الأمل',
      status: 'ACTIVE',
      userId: admin.id,
    },
  });

  // Invoices
  const invoice1 = await prisma.invoice.create({
    data: {
      number: 'INV-001',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      subtotal: 10000,
      taxRate: 15,
      taxAmount: 1500,
      total: 11500,
      status: InvoiceStatus.SENT,
      notes: 'فاتورة خدمات تقنية',
      userId: admin.id,
      customerId: customer1.id,
      items: {
        create: [
          { description: 'تصميم موقع إلكتروني', quantity: 1, unitPrice: 7000, total: 7000 },
          { description: 'استضافة سنة', quantity: 1, unitPrice: 3000, total: 3000 },
        ],
      },
    },
  });

  // Payments
  await prisma.payment.create({
    data: {
      date: new Date(),
      amount: 5000,
      method: PaymentMethod.BANK_TRANSFER,
      reference: 'TRX-001',
      notes: 'دفعة أولى',
      userId: admin.id,
      invoiceId: invoice1.id,
    },
  });

  // Expenses
  await prisma.expense.create({
    data: {
      date: new Date(),
      amount: 2500,
      category: 'مصروفات مكتبية',
      description: 'شراء أثاث مكتبي',
      userId: admin.id,
    },
  });

  await prisma.expense.create({
    data: {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      amount: 1200,
      category: 'مواصلات',
      description: 'بنزين ومواصلات',
      userId: admin.id,
    },
  });

  // Journal Entry
  const cashAccount = await prisma.account.findFirst({ where: { code: '1100', userId: admin.id } });
  const revenueAccount = await prisma.account.findFirst({ where: { code: '4100', userId: admin.id } });

  if (cashAccount && revenueAccount) {
    await prisma.journalEntry.create({
      data: {
        date: new Date(),
        reference: 'JE-001',
        description: 'قيد إيراد مبيعات',
        totalDebit: 11500,
        totalCredit: 11500,
        isPosted: true,
        userId: admin.id,
        lines: {
          create: [
            { debit: 11500, credit: 0, description: 'زيادة النقدية', debitAccountId: cashAccount.id },
            { debit: 0, credit: 11500, description: 'إيراد مبيعات', creditAccountId: revenueAccount.id },
          ],
        },
      },
    });
  }

  // Leads & Deals
  await prisma.lead.create({
    data: {
      title: 'عميل محتمل - مشروع ERP',
      description: 'شركة تحتاج نظام ERP متكامل',
      status: 'QUALIFIED',
      source: 'معرض تقني',
      userId: admin.id,
    },
  });

  await prisma.deal.create({
    data: {
      title: 'عقد صيانة سنوي',
      value: 50000,
      status: 'PENDING',
      description: 'عقد صيانة أنظمة CRM',
      userId: admin.id,
      customerId: customer1.id,
    },
  });

  console.log('✅ Seed completed!');
  console.log(`👤 Admin: admin@crm.com / admin123`);
  console.log(`👤 User: user@crm.com / user123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
