'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/Card';
import { ExportButtons } from '@/components/ExportButtons';

export default function ReportsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [pnl, setPnl] = useState<any>(null);
  const [tb, setTb] = useState<any[]>([]);
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  useEffect(() => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/reports/dashboard', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setDashboard);
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/reports/profit-loss', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setPnl);
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/reports/trial-balance', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(setTb);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">التقارير المالية</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-sm text-gray-500 mb-1">الإيرادات</div>
          <div className="text-2xl font-bold text-emerald-600">{pnl?.revenue?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">المصروفات</div>
          <div className="text-2xl font-bold text-red-600">{pnl?.expenses?.toLocaleString() || 0} ريال</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-500 mb-1">صافي الربح</div>
          <div className="text-2xl font-bold text-indigo-600">{pnl?.netProfit?.toLocaleString() || 0} ريال</div>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">ميزان المراجعة</h2>
        <ExportButtons tableId="trial-balance-table" filename="trial-balance" />
      </div>
      <Card className="mb-8">
        <table id="trial-balance-table" className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-700 font-semibold">
            <tr><th className="px-4 py-3">الكود</th><th className="px-4 py-3">الاسم</th><th className="px-4 py-3">مدين</th><th className="px-4 py-3">دائن</th><th className="px-4 py-3">الرصيد</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tb.map((acc: any) => (
              <tr key={acc.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono">{acc.code}</td>
                <td className="px-4 py-3 font-medium">{acc.name}</td>
                <td className="px-4 py-3">{acc.totalDebit?.toLocaleString()}</td>
                <td className="px-4 py-3">{acc.totalCredit?.toLocaleString()}</td>
                <td className="px-4 py-3 font-bold">{acc.balance?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
