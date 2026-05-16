'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export default function LeadsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', source: '', status: 'NEW' });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({ title: '', description: '', source: '', status: 'NEW' });
    fetchData();
  };

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">العملاء المحتملين</h1>
        <Button onClick={() => setModal(true)}>+ عميل محتمل</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>العنوان</Th><Th>المصدر</Th><Th>الحالة</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((l: any) => (
              <Tr key={l.id}>
                <Td className="font-medium">{l.title}</Td>
                <Td>{l.source || '-'}</Td>
                <Td><StatusBadge status={l.status} /></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="عميل محتمل جديد">
        <form onSubmit={handleSubmit}>
          <Input label="العنوان" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} required />
          <Input label="الوصف" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
          <Input label="المصدر" value={form.source} onChange={(e: any) => setForm({ ...form, source: e.target.value })} />
          <Select label="الحالة" value={form.status} onChange={(e: any) => setForm({ ...form, status: e.target.value })}
            options={[{value:'NEW',label:'جديد'},{value:'CONTACTED',label:'تم التواصل'},{value:'QUALIFIED',label:'مؤهل'},{value:'LOST',label:'ضائع'},{value:'CONVERTED',label:'محول'}]} />
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
  const colors: any = { NEW: 'bg-blue-100 text-blue-700', CONTACTED: 'bg-purple-100 text-purple-700', QUALIFIED: 'bg-emerald-100 text-emerald-700', LOST: 'bg-gray-100 text-gray-700', CONVERTED: 'bg-amber-100 text-amber-700' };
  const labels: any = { NEW: 'جديد', CONTACTED: 'تم التواصل', QUALIFIED: 'مؤهل', LOST: 'ضائع', CONVERTED: 'محول' };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
}
