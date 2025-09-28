// src/utils/getDecanEnriched.ts
import type { DecanRecord } from "../data/decansLoader";
import { normSign } from "../data/aliases";

export type DecanMeta = {
  title: string;
  ruler?: string;
  sub_sign?: string;
};

export type DecanMetaMap = Record<
  string,
  {
    1?: DecanMeta;
    2?: DecanMeta;
    3?: DecanMeta;
  }
>;

/**
 * Build a quick lookup: meta[sign][decanNumber] -> { title, ruler, sub_sign }
 * sign is normalized via normSign().
 */
export function buildDecanMetaMap(rows: DecanRecord[]): DecanMetaMap {
  const out: DecanMetaMap = {};
  for (const r of rows) {
    const sign = normSign(r.sign);
    const n = Number(r.decan_number);
    if (!sign || ![1, 2, 3].includes(n)) continue;
    if (!out[sign]) out[sign] = {};
    out[sign][n as 1 | 2 | 3] = {
      title: r.title,
      ruler: r.ruler || undefined,
      sub_sign: r.sub_sign || undefined,
    };
  }
  return out;
}
