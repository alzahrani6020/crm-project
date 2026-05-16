'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';

export default function InvoicesPage() {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ number: '', customerId: '', issueDate: '', dueDate: '', taxRate: 15, notes: '', items: [{ description: '', quantity: 1, unitPrice: 0 }] });
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const fetchData = () => {
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/invoices', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
    fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/customers', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setCustomers);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/invoices', {
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
        <h1 className="text-2xl font-bold text-gray-800">الفواتير</h1>
        <Button onClick={() => setModal(true)}>+ فاتورة جديدة</Button>
      </div>
      <Card>
        <Table>
          <Thead>
            <Tr><Th>الرقم</Th><Th>العميل</Th><Th>الإجمالي</Th><Th>الحالة</Th><Th>الاستحقاق</Th></Tr>
          </Thead>
          <Tbody>
            {data.map((inv: any) => (
              <Tr key={inv.id}>
                <Td>{inv.number}</Td>
                <Td>{inv.customer?.name}</Td>
                <Td className="font-bold">{inv.total?.toLocaleString()} ريال</Td>
                <Td><StatusBadge status={inv.status} /></Td>
                <Td>{new Date(inv.dueDate).toLocaleDateString('ar-SA')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="فاتورة جديدة">
        <form onSubmit={handleSubmit}>
          <Input label="رقم الفاتورة" value={form.number} onChange={(e: any) => setForm({ ...form, number: e.target.value })} required />
          <Select label="العميل" value={form.customerId} onChange={(e: any) => setForm({ ...form, customerId: e.target.value })}
            options={[{value:'',label:'اختر عميل...'},...customers.map((c:any)=>({value:c.id,label:c.name}))]} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="تاريخ الإصدار" type="date" value={form.issueDate} onChange={(e: any) => setForm({ ...form, issueDate: e.target.value })} required />
            <Input label="تاريخ الاستحقاق" type="date" value={form.dueDate} onChange={(e: any) => setForm({ ...form, dueDate: e.target.value })} required />
          </div>
          <Input label="نسبة الضريبة (%)" type="number" value={form.taxRate} onChange={(e: any) => setForm({ ...form, taxRate: Number(e.target.value) })} />
          <Input label="ملاحظات" value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />
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
  const colors: any = { DRAFT: 'bg-gray-100 text-gray-700', SENT: 'bg-blue-100 text-blue-700', PAID: 'bg-emerald-100 text-emerald-700', OVERDUE: 'bg-red-100 text-red-700', CANCELLED: 'bg-amber-100 text-amber-700' };
  const labels: any = { DRAFT: 'مسودة', SENT: 'مرسلة', PAID: 'مدفوعة', OVERDUE: 'متأخرة', CANCELLED: 'ملغاة' };
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{labels[status] || status}</span>;
}
