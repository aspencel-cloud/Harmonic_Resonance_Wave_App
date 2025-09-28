// src/components/CopyLinkButton.tsx
import React from "react";
import { copyToClipboard, toastCopyResult } from "../utils/clipboard";

type CopyLinkButtonProps = {
  getHashHref: () => string; // returns "#/library/..."
  ariaLabel: string;
  className?: string; // default: "chip" to match your CSS
  label?: string; // default: "Copy link"
};

export const CopyLinkButton: React.FC<CopyLinkButtonProps> = ({
  getHashHref,
  ariaLabel,
  className = "chip",
  label = "Copy link",
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={async () => {
        const url = `${location.origin}${location.pathname}${getHashHref()}`;
        const ok = await copyToClipboard(url);
        toastCopyResult(ok, "Link");
      }}
    >
      {label}
    </button>
  );
};
