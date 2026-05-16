'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const nav = [
  { href: '/', label: 'الرئيسية', icon: '📊' },
  { href: '/customers', label: 'العملاء', icon: '👥' },
  { href: '/leads', label: 'العملاء المحتملين', icon: '🔍' },
  { href: '/deals', label: 'الصفقات', icon: '💼' },
  { href: '/logistics', label: 'اللوجستيك', icon: '🚚' },
  { href: '/accounts', label: 'دليل الحسابات', icon: '📒' },
  { href: '/invoices', label: 'الفواتير', icon: '🧾' },
  { href: '/journal-entries', label: 'القيود اليومية', icon: '📋' },
  { href: '/expenses', label: 'المصروفات', icon: '💸' },
  { href: '/reports', label: 'التقارير', icon: '📈' },
];

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">CRM المحاسبي</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700 text-xs text-slate-400 text-center">
          CRM + Accounting v1.0
        </div>
      </aside>
      <main className="flex-1 mr-64 p-8">{children}</main>
    </div>
  );
}
