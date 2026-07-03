interface Row {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  enum?: string[];
}

export function PropsTable({ title, rows }: { title: string; rows: Row[] }) {
  if (!rows.length) return null;
  return (
    <div className='mt-6'>
      <h4 className='mb-2 text-xs font-semibold uppercase tracking-wide text-xental-text-primary-400'>{title}</h4>
      <div className='divide-y divide-border rounded-lg border border-border bg-card'>
        {rows.map((r) => (
          <div key={r.name} className='px-4 py-3'>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
              <code className='font-mono text-sm font-medium text-foreground'>{r.name}</code>
              <span className='font-mono text-xs text-xental-text-primary-400'>{r.type}</span>
              <span
                className={
                  r.required
                    ? 'text-[11px] font-medium text-failed'
                    : 'text-[11px] text-xental-text-primary-400'
                }
              >
                {r.required ? 'required' : 'optional'}
              </span>
            </div>
            {r.description && <p className='mt-1 text-sm text-xental-text-primary-500'>{r.description}</p>}
            {r.enum && (
              <p className='mt-1 text-xs text-xental-text-primary-400'>
                Options: {r.enum.map((e) => <code key={e} className='font-mono'>{e}</code>).reduce((prev, curr) => <>{prev}, {curr}</>)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
