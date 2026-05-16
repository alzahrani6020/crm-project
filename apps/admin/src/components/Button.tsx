export function Button({ children, onClick, variant = 'primary', type = 'button', disabled = false }: any) {
  const base = 'px-4 py-2 rounded-lg font-medium transition-colors text-sm';
  const styles = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant as keyof typeof styles]}`}>
      {children}
    </button>
  );
}
