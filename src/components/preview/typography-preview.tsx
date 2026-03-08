export function TypographyPreview() {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Typography</h3>
      <div className="space-y-1">
        <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Heading
        </p>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Body text with standard contrast for readability.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Secondary text for less prominent information.
        </p>
        <div className="flex gap-2 pt-1">
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--primary-subtle)', color: 'var(--primary-solid)' }}
          >
            Badge
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'var(--primary-solid)', color: 'var(--primary-text)' }}
          >
            Active
          </span>
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
            style={{ borderColor: 'var(--border)', color: 'var(--secondary-solid)' }}
          >
            Outline
          </span>
        </div>
      </div>
    </div>
  );
}
