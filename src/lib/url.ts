import type { PreviewMode, Scale } from '@/types';

interface UrlState {
  scales: Scale[];
  activeScaleId: string;
  mode: PreviewMode;
}

// Format: ?scales=primary:3b82f6:primary,neutral:737373:neutral&active=primary&mode=dark
export function encodeState(state: UrlState): string {
  const params = new URLSearchParams();
  const scalesStr = state.scales
    .map((s) => `${s.name}:${s.baseHex.replace('#', '')}:${s.role}`)
    .join(',');
  params.set('scales', scalesStr);
  if (state.activeScaleId) params.set('active', state.activeScaleId);
  if (state.mode === 'dark') params.set('mode', 'dark');
  return `?${params.toString()}`;
}

export function decodeState(): Partial<UrlState> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);

  // Support legacy single-colour URL: ?base=3b82f6
  const legacyBase = params.get('base');
  if (legacyBase) {
    const name = params.get('name') ?? 'primary';
    return {
      scales: [{ id: name, name, baseHex: `#${legacyBase}`, role: 'primary' }],
      activeScaleId: name,
      mode: (params.get('mode') as PreviewMode) ?? undefined,
    };
  }

  const scalesStr = params.get('scales');
  if (!scalesStr) return {};

  const scales: Scale[] = scalesStr.split(',').map((entry) => {
    const [name, hex, role] = entry.split(':');
    return {
      id: name,
      name,
      baseHex: `#${hex}`,
      role: (role ?? 'custom') as Scale['role'],
    };
  });

  return {
    scales,
    activeScaleId: params.get('active') ?? scales[0]?.id,
    mode: (params.get('mode') as PreviewMode) ?? undefined,
  };
}

export function updateUrl(state: UrlState): void {
  if (typeof window === 'undefined') return;
  const url = encodeState(state);
  window.history.replaceState(null, '', url);
}
