'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export default function DealsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', value: 0, status: 'PENDING', customerId: '' });
  const [customers, setCustomers] = useState([]);
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('http://localhost:3001/api/deals', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
    fetch('http://localhost:3001/api/customers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setCustomers);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({ title: '', description: '', value: 0, status: 'PENDING', customerId: '' });
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الصفقات</h1>
        <Button onClick={() => setModal(true)}>+ صفقة جديدة</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>العنوان</Th><Th>القيمة</Th><Th>الحالة</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((d: any) => (
              <Tr key={d.id}>
                <Td className="font-medium">{d.title}</Td>
                <Td className="font-bold">{d.value?.toLocaleString()} ريال</Td>
                <Td><StatusBadge status={d.status} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="صفقة جديدة">
        <form onSubmit={handleSubmit}>
          <Input label="العنوان" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} required />
          <Input label="الوصف" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
          <Input label="القيمة" type="number" value={form.value} onChange={(e: any) => setForm({ ...form, value: Number(e.target.value) })} required />
          <Select label="الحالة" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })}
            options={[{value:'PENDING',label:'معلقة'},{value:'WON',label:'فازت'},{value:'LOST',label:'خسرت'},{value:'CANCELLED',label:'ملغاة'}]} />
          <Select label="العميل" value={form.customerId} onChange={(e: any) => setForm({ ...form, customerId: e.target.value })}
            options={[{value:'',label:'اختر عميل...'},...customers.map((c:any)=>({value:c.id,label:c.name}))]} />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setModal(false)} type="button">إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = { PENDING: 'bg-amber-100 text-amber-700', WON: 'bg-emerald-100 text-emerald-700', LOST: 'bg-red-100 text-red-700', CANCELLED: 'bg-gray-100 text-gray-700' };
  const labels: any = { PENDING: 'معلقة', WON: 'فازت', LOST: 'خسرت', CANCELLED: 'ملغاة' };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
}
