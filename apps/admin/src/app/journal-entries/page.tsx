'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';

export default function JournalEntriesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ date: '', reference: '', description: '', lines: [{ debitAccountId: '', creditAccountId: '', debit: 0, credit: 0, description: '' }] });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('http://localhost:3001/api/journal-entries', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('http://localhost:3001/api/journal-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">القيود اليومية</h1>
        <Button onClick={() => setModal(true)}>+ قيد جديد</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>التاريخ</Th><Th>الرقم</Th><Th>الوصف</Th><Th>مدين</Th><Th>دائن</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((je: any) => (
              <Tr key={je.id}>
                <Td>{new Date(je.date).toLocaleDateString('ar-SA')}</Td>
                <Td className="font-mono text-sm">{je.reference || '-'}</Td>
                <Td>{je.description || '-'}</Td>
                <Td className="font-bold">{je.totalDebit?.toLocaleString()}</Td>
                <Td className="font-bold">{je.totalCredit?.toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="قيد محاسبي جديد">
        <form onSubmit={handleSubmit}>
          <Input label="التاريخ" type="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} required />
          <Input label="الرقم المرجعي" value={form.reference} onChange={(e: any) => setForm({ ...form, reference: e.target.value })} />
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
