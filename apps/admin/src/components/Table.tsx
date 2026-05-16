export function Table({ children }: any) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm text-right">{children}</table>
    </div>
  );
}

export function Thead({ children }: any) {
  return <thead className="bg-gray-50 text-gray-700 font-semibold">{children}</thead>;
}

export function Tbody({ children }: any) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function Tr({ children, className = '' }: any) {
  return <tr className={`hover:bg-gray-50 transition-colors ${className}`}>{children}</tr>;
}

export function Th({ children }: any) {
  return <th className="px-4 py-3">{children}</th>;
}

export function Td({ children, className = '' }: any) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
