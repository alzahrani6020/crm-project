'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export default function CustomersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', status: 'ACTIVE' });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/customers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({ name: '', email: '', phone: '', company: '', status: 'ACTIVE' });
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">العملاء</h1>
        <Button onClick={() => setModal(true)}>+ إضافة عميل</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr>
              <Th>الاسم</Th><Th>البريد</Th><Th>الهاتف</Th><Th>الشركة</Th><Th>الحالة</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((c: any) => (
              <Tr key={c.id}>
                <Td>{c.name}</Td>
                <Td>{c.email || '-'}</Td>
                <Td>{c.phone || '-'}</Td>
                <Td>{c.company || '-'}</Td>
                <Td><StatusBadge status={c.status} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="إضافة عميل جديد">
        <form onSubmit={handleSubmit}>
          <Input label="الاسم" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
          <Input label="البريد الإلكتروني" type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
          <Input label="الهاتف" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
          <Input label="الشركة" value={form.company} onChange={(e: any) => setForm({ ...form, company: e.target.value })} />
          <Select label="الحالة" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })}
            options={[{value:'ACTIVE',label:'نشط'},{value:'INACTIVE',label:'غير نشط'},{value:'ARCHIVED',label:'مؤرشف'}]} />
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
  const colors: any = { ACTIVE: 'bg-emerald-100 text-emerald-700', INACTIVE: 'bg-gray-100 text-gray-700', ARCHIVED: 'bg-amber-100 text-amber-700' };
  const labels: any = { ACTIVE: 'نشط', INACTIVE: 'غير نشط', ARCHIVED: 'مؤرشف' };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
}
