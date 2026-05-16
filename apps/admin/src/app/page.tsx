'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  useEffect(() => {
    fetch('http://localhost:3001/api/reports/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card>
          <div className="text-sm text-gray-500 mb-1">إجمالي الإيرادات</div>
          <div className="text-3xl font-bold text-emerald-600">{stats?.totalRevenue?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">المدفوعات المحصلة</div>
          <div className="text-3xl font-bold text-indigo-600">{stats?.totalPayments?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">المصروفات</div>
          <div className="text-3xl font-bold text-red-600">{stats?.totalExpenses?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">صافي الدخل</div>
          <div className="text-3xl font-bold text-amber-600">{stats?.netIncome?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">عدد العملاء</div>
          <div className="text-3xl font-bold text-blue-600">{stats?.customersCount || 0}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">فواتير غير مسددة</div>
          <div className="text-3xl font-bold text-rose-600">{stats?.unpaidInvoices || 0}</div>
        </Card>
      </div>

      <h2 className="text-lg font-bold text-gray-800 mb-4">الأقسام</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NavCard href="/customers" title="العملاء" desc="إدارة بيانات العملاء" color="bg-blue-500" />
        <NavCard href="/invoices" title="الفواتير" desc="إصدار ومتابعة الفواتير" color="bg-amber-500" />
        <NavCard href="/accounts" title="دليل الحسابات" desc="الحسابات المحاسبية" color="bg-emerald-500" />
        <NavCard href="/expenses" title="المصروفات" desc="تتبع المصروفات" color="bg-rose-500" />
        <NavCard href="/journal-entries" title="القيود اليومية" desc="العمليات المحاسبية" color="bg-red-500" />
        <NavCard href="/leads" title="العملاء المحتملين" desc="متابعة الفرص" color="bg-purple-500" />
        <NavCard href="/deals" title="الصفقات" desc="إدارة العقود" color="bg-cyan-500" />
        <NavCard href="/reports" title="التقارير" desc="التقارير المالية" color="bg-indigo-500" />
      </div>
    </div>
  );
}

function NavCard({ href, title, desc, color }: { href: string; title: string; desc: string; color: string }) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 rounded-lg ${color} mb-4`} />
        <h3 className="font-bold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
    </Link>
  );
}
