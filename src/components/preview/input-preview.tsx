export function InputPreview() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Inputs</h3>
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Email address"
          readOnly
          className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        />
        <input
          type="text"
          defaultValue="hello@example.com"
          readOnly
          className="w-full px-3 py-2 rounded-lg text-sm border-2 outline-none"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--primary-solid)',
            color: 'var(--text-primary)',
          }}
        />
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-5 rounded-full relative cursor-pointer"
            style={{ backgroundColor: 'var(--primary-solid)' }}
          >
            <div
              className="w-4 h-4 rounded-full absolute top-0.5 right-0.5"
              style={{ backgroundColor: 'var(--surface)' }}
            />
          </div>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Notifications
          </span>
        </div>
      </div>
    </div>
  );
}
