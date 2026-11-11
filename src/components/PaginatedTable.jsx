import { Children, cloneElement, useId, useState } from 'react';

// Retains existing table markup/actions while bounding the number of rendered rows.
export default function PaginatedTable({ children: table, pageSize = 10, label = 'Tabel data' }) {
  const id = useId();
  const [selection, setSelection] = useState({ signature: '', page: 1 });
  const parts = Children.toArray(table.props.children);
  const body = parts.find(part => part.type === 'tbody');
  const rows = body ? Children.toArray(body.props.children) : [];
  const signature = rows.map(row => row.key).join('|');
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const page = selection.signature === signature ? Math.min(selection.page, pages) : 1;
  if (pages === 1) return table;
  const offset = (page - 1) * pageSize;
  const change = next => setSelection({ signature, page: next });
  const content = cloneElement(table, { id }, parts.map(part => part === body ? cloneElement(body, {}, rows.slice(offset, offset + pageSize)) : part));
  return <>{content}<nav className="table-pagination" aria-label={`Navigasi halaman ${label}`}>
    <span role="status">{offset + 1}–{Math.min(offset + pageSize, rows.length)} dari {rows.length} data · Halaman {page}/{pages}</span>
    <div><button type="button" aria-controls={id} disabled={page === 1} onClick={() => change(page - 1)}>Sebelumnya</button>
    <button type="button" aria-controls={id} disabled={page === pages} onClick={() => change(page + 1)}>Berikutnya</button></div>
  </nav></>;
}
