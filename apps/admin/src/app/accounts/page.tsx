'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export default function AccountsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: 'ASSET', description: '', balance: 0 });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/accounts', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({ code: '', name: '', type: 'ASSET', description: '', balance: 0 });
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">دليل الحسابات</h1>
        <Button onClick={() => setModal(true)}>+ حساب جديد</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>الكود</Th><Th>الاسم</Th><Th>النوع</Th><Th>الرصيد</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((acc: any) => (
              <Tr key={acc.id}>
                <Td className="font-mono text-sm">{acc.code}</Td>
                <Td className="font-medium">{acc.name}</Td>
                <Td><TypeBadge type={acc.type} /></Td>
                <Td className="font-bold">{acc.balance?.toLocaleString()} ريال</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="حساب محاسبي جديد">
        <form onSubmit={handleSubmit}>
          <Input label="الكود" value={form.code} onChange={(e: any) => setForm({ ...form, code: e.target.value })} required />
          <Input label="اسم الحساب" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
          <Select label="النوع" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })}
            options={[
              {value:'ASSET',label:'أصول'},
              {value:'LIABILITY',label:'التزامات'},
              {value:'EQUITY',label:'حقوق ملكية'},
              {value:'REVENUE',label:'إيرادات'},
              {value:'EXPENSE',label:'مصروفات'},
            ]} />
          <Input label="الوصف" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
          <Input label="الرصيد الافتتاحي" type="number" value={form.balance} onChange={(e: any) => setForm({ ...form, balance: Number(e.target.value) })} />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setModal(false)} type="button">إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: any = { ASSET: 'bg-blue-100 text-blue-700', LIABILITY: 'bg-orange-100 text-orange-700', EQUITY: 'bg-purple-100 text-purple-700', REVENUE: 'bg-emerald-100 text-emerald-700', EXPENSE: 'bg-red-100 text-red-700' };
  const labels: any = { ASSET: 'أصول', LIABILITY: 'التزامات', EQUITY: 'حقوق ملكية', REVENUE: 'إيرادات', EXPENSE: 'مصروفات' };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100'}`}>{labels[type] || type}</span>;
}
