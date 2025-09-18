// utils/export.ts

// ---------- helpers ----------
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ensureSvg(el?: SVGSVGElement | null): SVGSVGElement {
  const svg = el || (document.querySelector("svg") as SVGSVGElement | null);
  if (!svg) throw new Error("No <svg> element found on the page.");
  return svg;
}

// Inline external CSS into the SVG so PNG rendering has styles
function inlineSvgStyles(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;

  const cssTexts: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      const rules = (sheet as CSSStyleSheet).cssRules;
      if (!rules) continue;
      for (const rule of Array.from(rules)) {
        cssTexts.push((rule as CSSRule).cssText);
      }
    } catch {
      // cross-origin stylesheet — skip quietly
    }
  }
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.innerHTML = cssTexts.join("\n");

  // Prepend <style> into the cloned SVG
  const first = clone.firstChild;
  if (first) clone.insertBefore(style, first);
  else clone.appendChild(style);

  // Ensure width/height attrs exist for rasterization
  const bbox = svg.getBBox();
  const width = Number(svg.getAttribute("width")) || bbox.width || 800;
  const height = Number(svg.getAttribute("height")) || bbox.height || 800;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("viewBox", svg.getAttribute("viewBox") || `0 0 ${width} ${height}`);

  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clone);
  return `<?xml version="1.0" standalone="no"?>\n${svgStr}`;
}

// ---------- public API ----------
export function exportSvg(svgEl?: SVGSVGElement | null, filename = "wheel.svg") {
  const svg = ensureSvg(svgEl);
  const svgStr = inlineSvgStyles(svg);
  const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}

export function exportPng(svgEl?: SVGSVGElement | null, filename = "wheel.png", scale = 2) {
  const svg = ensureSvg(svgEl);
  const svgStr = inlineSvgStyles(svg);
  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  // Determine intrinsic size
  const bbox = svg.getBBox();
  const width = Number(svg.getAttribute("width")) || bbox.width || 800;
  const height = Number(svg.getAttribute("height")) || bbox.height || 800;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(width * scale));
  canvas.height = Math.max(1, Math.floor(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error("Cannot get 2D context for canvas.");
  }

  const img = new Image();
  img.onload = () => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, filename);
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    throw new Error("Failed to load SVG into image for PNG export.");
  };
  img.src = url;
}

export function exportJson(obj: unknown, filename = "data.json") {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  downloadBlob(blob, filename);
}

type Row = Record<string, unknown>;

export function exportCsv(rows: Row[], filename = "data.csv") {
  if (!rows || !rows.length) {
    // still create an empty file with UTF-8 BOM so Excel opens it cleanly
    const empty = "\uFEFF";
    downloadBlob(new Blob([empty], { type: "text/csv;charset=utf-8" }), filename);
    return;
  }
  // Build union of all keys so columns don't disappear when some rows lack fields
  const headerSet = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);

  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // escape quotes and wrap when needed
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];

  // UTF-8 BOM for Excel
  const csv = "\uFEFF" + lines.join("\n");
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}
