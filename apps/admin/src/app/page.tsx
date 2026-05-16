'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    fetch('http://localhost:3001/api/reports/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>جاري التحميل...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: 32 }}>لوحة التحكم</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard title="إجمالي الإيرادات" value={`${stats?.totalRevenue?.toLocaleString() || 0} ريال`} color="#10b981" />
        <StatCard title="المدفوعات" value={`${stats?.totalPayments?.toLocaleString() || 0} ريال`} color="#4f46e5" />
        <StatCard title="المصروفات" value={`${stats?.totalExpenses?.toLocaleString() || 0} ريال`} color="#ef4444" />
        <StatCard title="صافي الدخل" value={`${stats?.netIncome?.toLocaleString() || 0} ريال`} color="#f59e0b" />
        <StatCard title="العملاء" value={stats?.customersCount || 0} color="#06b6d4" />
        <StatCard title="فواتير غير مسددة" value={stats?.unpaidInvoices || 0} color="#ec4899" />
      </div>

      <h2 style={{ marginBottom: 20 }}>الأقسام</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
        <Card href="/customers" title="العملاء" desc="إدارة العملاء" color="#4f46e5" />
        <Card href="/invoices" title="الفواتير" desc="إصدار ومتابعة الفواتير" color="#f59e0b" />
        <Card href="/accounts" title="دليل الحسابات" desc="الحسابات المحاسبية" color="#10b981" />
        <Card href="/expenses" title="المصروفات" desc="تتبع المصروفات" color="#ec4899" />
        <Card href="/journal-entries" title="القيود اليومية" desc="العمليات المحاسبية" color="#ef4444" />
        <Card href="/reports" title="التقارير" desc="التقارير المالية" color="#6366f1" />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

function Card({ href, title, desc, color }: { href: string; title: string; desc: string; color: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{ padding: 24, borderRadius: 12, background: '#fff', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: color, marginBottom: 12 }} />
        <h3 style={{ margin: 0, color: '#111827' }}>{title}</h3>
        <p style={{ margin: '8px 0 0', color: '#6b7280', fontSize: 14 }}>{desc}</p>
      </div>
    </Link>
  );
}
