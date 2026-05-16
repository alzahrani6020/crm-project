'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';

export default function ExpensesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: '', amount: 0, category: '', description: '' });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/expenses', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({ date: '', amount: 0, category: '', description: '' });
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المصروفات</h1>
        <Button onClick={() => setModal(true)}>+ مصروف جديد</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>التاريخ</Th><Th>الفئة</Th><Th>الوصف</Th><Th>المبلغ</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((ex: any) => (
              <Tr key={ex.id}>
                <Td>{new Date(ex.date).toLocaleDateString('ar-SA')}</Td>
                <Td>{ex.category}</Td>
                <Td>{ex.description || '-'}</Td>
                <Td className="font-bold text-red-600">{ex.amount?.toLocaleString()} ريال</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="مصروف جديد">
        <form onSubmit={handleSubmit}>
          <Input label="التاريخ" type="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} required />
          <Input label="المبلغ" type="number" value={form.amount} onChange={(e: any) => setForm({ ...form, amount: Number(e.target.value) })} required />
          <Input label="الفئة" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} required />
          <Input label="الوصف" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setModal(false)} type="button">إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
