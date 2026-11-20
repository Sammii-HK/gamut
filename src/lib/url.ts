import type { PreviewMode, Scale } from "@/types";
interface UrlState {
  scales: Scale[];
  activeScaleId: string;
  mode: PreviewMode;
}
const roles = new Set(["primary", "secondary", "accent", "neutral", "custom"]);
const colour = (value: unknown): value is string =>
  typeof value === "string" && /^#[a-f\d]{6}$/i.test(value);
const mode = (value: unknown): PreviewMode =>
  value === "dark" ? "dark" : "light";

/** Version two preserves IDs and names separately; punctuation cannot split a scale. */
export function encodeState(state: UrlState): string {
  const params = new URLSearchParams();
  params.set("v", "2");
  params.set("scales", JSON.stringify(state.scales));
  params.set("active", state.activeScaleId);
  params.set("mode", state.mode);
  return `?${params}`;
}
export function decodeQuery(query: string): Partial<UrlState> {
  const params = new URLSearchParams(query);
  let candidates: unknown;
  if (params.get("v") === "2") {
    try {
      candidates = JSON.parse(params.get("scales") ?? "null");
    } catch {
      return {};
    }
  } else if (params.has("base")) {
    const name = params.get("name") || "primary";
    candidates = [
      { id: name, name, baseHex: `#${params.get("base")}`, role: "primary" },
    ];
  } else {
    const raw = params.get("scales");
    if (!raw) return {};
    candidates = raw.split(",").map((entry) => {
      const [name, hex, role] = entry.split(":");
      return { id: name, name, baseHex: `#${hex}`, role: role || "custom" };
    });
  }
  if (
    !Array.isArray(candidates) ||
    !candidates.length ||
    candidates.length > 64
  )
    return {};
  const ids = new Set<string>();
  const scales: Scale[] = [];
  for (const entry of candidates) {
    if (!entry || typeof entry !== "object") return {};
    const { id, name, baseHex, role } = entry;
    if (
      typeof id !== "string" ||
      !id ||
      id.length > 100 ||
      ids.has(id) ||
      typeof name !== "string" ||
      name.length > 100 ||
      !colour(baseHex) ||
      !roles.has(role)
    )
      return {};
    ids.add(id);
    scales.push({ id, name, baseHex, role });
  }
  const active = params.get("active");
  return {
    scales,
    activeScaleId: active && ids.has(active) ? active : scales[0].id,
    mode: mode(params.get("mode")),
  };
}
export function decodeState(): Partial<UrlState> {
  return typeof window === "undefined"
    ? {}
    : decodeQuery(window.location.search);
}
export function updateUrl(state: UrlState): void {
  if (typeof window !== "undefined")
    window.history.replaceState(null, "", encodeState(state));
}
