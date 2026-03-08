export function CardPreview() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Cards</h3>
      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg mb-3"
            style={{ backgroundColor: 'var(--primary-solid)' }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Analytics
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            12 new insights
          </p>
        </div>
        <div
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: 'var(--surface-raised)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg mb-3"
            style={{ backgroundColor: 'var(--accent-solid)' }}
          />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Settings
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            3 pending changes
          </p>
        </div>
      </div>
    </div>
  );
}
