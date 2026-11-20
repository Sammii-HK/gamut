export function ButtonPreview() {
  return (
    <div className="space-y-3">
      <h3
        className="text-xs font-medium"
        style={{ color: "var(--text-muted)" }}
      >
        Buttons
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--primary-solid)",
            color: "var(--primary-text)",
          }}
        >
          Primary
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
          style={{
            backgroundColor: "transparent",
            color: "var(--primary-solid)",
            borderColor: "var(--border)",
          }}
        >
          Secondary
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--primary-subtle)",
            color: "var(--primary-solid)",
          }}
        >
          Subtle
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: "var(--accent-solid)",
            color: "var(--primary-text)",
          }}
        >
          Accent
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors opacity-50 cursor-not-allowed"
          style={{
            backgroundColor: "var(--surface-raised)",
            color: "var(--text-muted)",
          }}
        >
          Disabled
        </button>
      </div>
    </div>
  );
}
