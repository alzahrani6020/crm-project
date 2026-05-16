'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/login') return <>{children}</>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 260, background: '#1e293b', color: '#fff', padding: 24, flexShrink: 0 }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 22 }}>CRM Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <NavLink href="/" label="الرئيسية" />
          <NavLink href="/customers" label="العملاء" />
          <NavLink href="/leads" label="العملاء المحتملين" />
          <NavLink href="/deals" label="الصفقات" />
          <hr style={{ borderColor: '#334155', margin: '12px 0' }} />
          <NavLink href="/accounts" label="دليل الحسابات" />
          <NavLink href="/invoices" label="الفواتير" />
          <NavLink href="/journal-entries" label="القيود اليومية" />
          <NavLink href="/expenses" label="المصروفات" />
          <NavLink href="/reports" label="التقارير" />
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 32 }}>
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link href={href} style={{
      padding: '10px 16px',
      borderRadius: 8,
      background: active ? '#4f46e5' : 'transparent',
      color: '#fff',
      textDecoration: 'none',
      fontSize: 15,
      transition: 'background 0.2s'
    }}>
      {label}
    </Link>
  );
}
