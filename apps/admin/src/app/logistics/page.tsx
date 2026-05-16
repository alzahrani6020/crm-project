'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/Input';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dialogue-terry-chubby-cosmetics.trycloudflare.com/api';

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState('vehicles');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<any>({});
  const token = typeof document !== 'undefined' ? document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] : '';

  const endpoints: any = {
    vehicles: `${API_URL}/vehicles`,
    drivers: `${API_URL}/drivers`,
    shipments: `${API_URL}/shipments`,
    maintenance: `${API_URL}/maintenance`,
  };

  const fetchData = () => {
    setLoading(true);
    fetch(endpoints[activeTab], { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(endpoints[activeTab], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setModal(false);
    setForm({});
    fetchData();
  };

  const tabs = [
    { key: 'vehicles', label: '🚚 المركبات' },
    { key: 'drivers', label: '👨‍✈️ السائقين' },
    { key: 'shipments', label: '📦 الشحنات' },
    { key: 'maintenance', label: '🔧 الصيانة' },
  ];

  if (loading) return <div className="p-8">جاري التحميل...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">اللوجستيك</h1>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{tabs.find((t) => t.key === activeTab)?.label}</h2>
        <Button onClick={() => setModal(true)}>+ إضافة</Button>
      </div>

      <Card>
        <Table>
          <Thead>
            <Tr>
              {activeTab === 'vehicles' && <><Th>رقم اللوحة</Th><Th>النوع</Th><Th>الموديل</Th><Th>الحالة</Th></>}
              {activeTab === 'drivers' && <><Th>الاسم</Th><Th>رقم الرخصة</Th><Th>الهاتف</Th><Th>الحالة</Th></>}
              {activeTab === 'shipments' && <><Th>رقم التتبع</Th><th>المرسل</th><th>المستلم</th><th>الحالة</th></>}
              {activeTab === 'maintenance' && <><Th>النوع</Th><Th>المركبة</Th><Th>التاريخ</Th><Th>التكلفة</Th></>}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item: any) => (
              <Tr key={item.id}>
                {activeTab === 'vehicles' && <><Td>{item.plateNumber}</Td><Td>{item.type}</Td><Td>{item.model || '-'}</Td><Td>{item.status}</Td></>}
                {activeTab === 'drivers' && <><Td>{item.name}</Td><Td>{item.licenseNo}</Td><Td>{item.phone || '-'}</Td><Td>{item.status}</Td></>}
                {activeTab === 'shipments' && <><Td>{item.trackingNo}</Td><Td>{item.senderName}</Td><Td>{item.receiverName}</Td><Td>{item.status}</Td></>}
                {activeTab === 'maintenance' && <><Td>{item.type}</Td><Td>{item.vehicle?.plateNumber || '-'}</Td><Td>{new Date(item.date).toLocaleDateString('ar-SA')}</Td><Td>{item.cost || 0} ريال</Td></>}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={`إضافة ${tabs.find((t) => t.key === activeTab)?.label}`}>
        <form onSubmit={handleSubmit}>
          {activeTab === 'vehicles' && (
            <>
              <Input label="رقم اللوحة" value={form.plateNumber || ''} onChange={(e: any) => setForm({ ...form, plateNumber: e.target.value })} required />
              <Input label="النوع" value={form.type || ''} onChange={(e: any) => setForm({ ...form, type: e.target.value })} required />
              <Input label="الموديل" value={form.model || ''} onChange={(e: any) => setForm({ ...form, model: e.target.value })} />
            </>
          )}
          {activeTab === 'drivers' && (
            <>
              <Input label="الاسم" value={form.name || ''} onChange={(e: any) => setForm({ ...form, name: e.target.value })} required />
              <Input label="رقم الرخصة" value={form.licenseNo || ''} onChange={(e: any) => setForm({ ...form, licenseNo: e.target.value })} required />
              <Input label="الهاتف" value={form.phone || ''} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
            </>
          )}
          {activeTab === 'shipments' && (
            <>
              <Input label="رقم التتبع" value={form.trackingNo || ''} onChange={(e: any) => setForm({ ...form, trackingNo: e.target.value })} required />
              <Input label="اسم المرسل" value={form.senderName || ''} onChange={(e: any) => setForm({ ...form, senderName: e.target.value })} required />
              <Input label="اسم المستلم" value={form.receiverName || ''} onChange={(e: any) => setForm({ ...form, receiverName: e.target.value })} required />
            </>
          )}
          {activeTab === 'maintenance' && (
            <>
              <Input label="نوع الصيانة" value={form.type || ''} onChange={(e: any) => setForm({ ...form, type: e.target.value })} required />
              <Input label="تكلفة الصيانة" type="number" value={form.cost || ''} onChange={(e: any) => setForm({ ...form, cost: Number(e.target.value) })} />
              <Input label="تاريخ الصيانة" type="date" value={form.date || ''} onChange={(e: any) => setForm({ ...form, date: e.target.value })} required />
            </>
          )}
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={() => setModal(false)} type="button">إلغاء</Button>
            <Button type="submit">حفظ</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
