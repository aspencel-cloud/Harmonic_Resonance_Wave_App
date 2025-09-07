// Simple helpers to export the wheel and state

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---- SVG ----
export function exportSvg(filename = "wheel.svg") {
  const svg = document.querySelector("svg");
  if (!svg) return;

  // serialize
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // add XML header if missing
  if (!source.match(/^<\?xml/)) {
    source = `<?xml version="1.0" standalone="no"?>\n` + source;
  }

  const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  triggerDownload(blob, filename);
}

// ---- PNG ----
export async function exportPng(filename = "wheel.png", scale = 2) {
  const svg = document.querySelector("svg");
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  // important for cross-origin fonts in some environments
  img.crossOrigin = "anonymous";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });

  const rect = svg.getBoundingClientRect();
  const w = Math.max(1, Math.floor(rect.width * scale));
  const h = Math.max(1, Math.floor(rect.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = getComputedStyle(document.body).backgroundColor || "#111";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);

  canvas.toBlob((blob) => {
    if (blob) triggerDownload(blob, filename);
    URL.revokeObjectURL(url);
  }, "image/png");
}

// ---- JSON (full app state or placements) ----
export function exportJson(filename = "data.json", data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, filename);
}

// ---- Placements CSV (if you call this anywhere) ----
export function exportCsv(
  filename = "placements.csv",
  rows: Array<Record<string, any>>
) {
  if (!rows || rows.length === 0) {
    const blob = new Blob([""], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, filename);
    return;
  }

  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, filename);
}
