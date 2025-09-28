import { useEffect, useState } from "react";

export type Route =
  | { name: "home" }
  | { name: "waveLib"; waveId: number }
  | { name: "decanLib"; sign: string; decan: 1 | 2 | 3 };

export function useHashRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash)
  );
  useEffect(() => {
    const on = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean); // e.g. ["library","waves","5"]
  if (parts[0] === "library" && parts[1] === "waves" && parts[2]) {
    const waveId = Number(parts[2]);
    if (Number.isFinite(waveId) && waveId >= 1 && waveId <= 10)
      return { name: "waveLib", waveId };
  }
  if (parts[0] === "library" && parts[1] === "decans" && parts[2] && parts[3]) {
    const decan = Number(parts[3]) as 1 | 2 | 3;
    if ([1, 2, 3].includes(decan)) {
      return { name: "decanLib", sign: decodeURIComponent(parts[2]), decan };
    }
  }
  return { name: "home" };
}

export function navTo(hash: string) {
  window.location.hash = hash.startsWith("#") ? hash : `#${hash}`;
}
