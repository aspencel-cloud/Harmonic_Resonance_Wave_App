export function exportCsv(rows: Record<string, any>[], filename = "data.csv") {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val === null || val === undefined) return "";
    // normalize newlines and ensure string
    let s = String(val).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    // guard against quotes/commas/newlines
    if (/[",\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];

  const csv = lines.join("\r\n");

  // IMPORTANT: add UTF-8 BOM so Excel stops showing “Â°”
  const BOM = "\ufeff";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });

  const a = document.createElement("a");
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
