import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { generatePalette } from "../src/lib/palette.ts";
import {
  defaultTokens,
  buildPaletteMap,
  resolveAllTokens,
  paletteNames,
} from "../src/lib/tokens.ts";
import { exportTheme } from "../src/lib/export.ts";
import { decodeQuery, encodeState } from "../src/lib/url.ts";
const scales = [
  {
    id: "primary",
    name: "primary",
    baseHex: "#8544cc",
    role: "primary" as const,
  },
  {
    id: "neutral",
    name: "neutral",
    baseHex: "#737373",
    role: "neutral" as const,
  },
];

test("renaming primary and neutral preserves semantic colours in both previews and every semantic export", () => {
  const tokens = defaultTokens(scales);
  const initial = scales.map((s) => generatePalette(s.baseHex, s.name, s.id));
  const renamed = scales.map((s) =>
    generatePalette(s.baseHex, s.id === "primary" ? "orchid" : "slate", s.id),
  );
  for (const mode of ["light", "dark"] as const) {
    const before = resolveAllTokens(tokens, buildPaletteMap(initial), mode),
      after = resolveAllTokens(tokens, buildPaletteMap(renamed), mode);
    assert.deepEqual(after, before);
    assert.ok(!Object.values(after).includes("#888888"));
    assert.equal(
      JSON.parse(exportTheme(renamed, tokens, mode, "json")).tokens[
        "--primary-solid"
      ],
      before["--primary-solid"],
    );
    assert.ok(
      exportTheme(renamed, tokens, mode, "css").includes(
        `--primary-solid: ${before["--primary-solid"]};`,
      ),
    );
    const dictionary = JSON.parse(exportTheme(renamed, tokens, mode, "figma"));
    assert.equal(
      dictionary[`semantic-${mode}`]["primary-solid"].value,
      before["--primary-solid"],
    );
  }
});
test("new custom-role palettes use stable IDs, including after a role change", () => {
  const custom = [
    {
      id: "uuid-1",
      name: "My colour",
      baseHex: "#aabbcc",
      role: "primary" as const,
    },
  ];
  const palettes = custom.map((s) => generatePalette(s.baseHex, s.name, s.id));
  const resolved = resolveAllTokens(
    defaultTokens(custom),
    buildPaletteMap(palettes),
    "light",
  );
  assert.equal(
    resolved["--primary-solid"],
    palettes[0].steps.find((s) => s.step === 500)?.hex,
  );
});
test("duplicate, empty and punctuation names export unique safe keys without losing colours", () => {
  const palettes = [
    "A colour",
    "A colour",
    "",
    "semantic-light",
    "x'; bad-code()",
  ].map((name, i) => generatePalette("#8544cc", name, `id-${i}`));
  const names = [...paletteNames(palettes).values()];
  assert.equal(new Set(names).size, 5);
  assert.ok(names.every((name) => /^[a-z_][a-z0-9_-]*$/.test(name)));
  assert.ok(!names.includes("semantic-light"));
  const sandbox = { module: { exports: {} } };
  vm.runInNewContext(
    exportTheme(palettes, defaultTokens([]), "light", "tailwind"),
    sandbox,
  );
  const json = JSON.parse(
    exportTheme(palettes, defaultTokens([]), "light", "json"),
  );
  assert.equal(Object.keys(json.scales).length, 5);
});
test("shared URLs retain active stable IDs across renames, duplicate labels and punctuation", () => {
  const state = {
    scales: [
      { ...scales[0], name: "Brand: rose, summer" },
      { ...scales[1], name: "Brand: rose, summer" },
    ],
    activeScaleId: "neutral",
    mode: "dark" as const,
  };
  assert.deepEqual(decodeQuery(encodeState(state)), state);
  assert.equal(
    decodeQuery("?scales=brand:8544cc:primary,grey:737373:neutral&active=brand")
      .activeScaleId,
    "brand",
  );
  assert.equal(
    decodeQuery("?base=8544cc&name=old").scales?.[0].baseHex,
    "#8544cc",
  );
});
test("malformed or invalid shared colours cannot poison the colour maths", () => {
  for (const query of [
    "?v=2&scales=not-json",
    "?scales=bad:zzzzzz:primary",
    "?base=not-a-colour",
    "?scales=same:8544cc:primary,same:737373:neutral",
  ])
    assert.deepEqual(decodeQuery(query), {});
  const state = decodeQuery(
    "?scales=brand:8544cc:primary&active=missing&mode=invalid",
  );
  assert.equal(state.activeScaleId, "brand");
  assert.equal(state.mode, "light");
});
