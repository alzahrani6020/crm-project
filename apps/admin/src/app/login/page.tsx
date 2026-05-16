'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"}/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'فشل تسجيل الدخول');

      document.cookie = `token=${data.accessToken}; path=/; max-age=604800`;
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f3f4f6',
      fontFamily: 'system-ui',
      direction: 'rtl'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: 40,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: 24 }}>تسجيل الدخول</h1>
        {error && <div style={{ color: '#ef4444', marginBottom: 16, textAlign: 'center' }}>{error}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 16 }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'جاري الدخول...' : 'دخول'}
        </button>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#6b7280', fontSize: 14 }}>
          admin@crm.com / admin123
        </p>
      </form>
    </div>
  );
}
