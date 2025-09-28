// src/components/AccessibleChipRow.tsx
import React, { useEffect, useRef, useState } from "react";

export type ChipItem = {
  id: string;
  label: string;
  ariaLabel?: string;
  onActivate: () => void; // click or Enter/Space
};

export type AccessibleChipRowProps = {
  chips: ChipItem[];
  ariaLabel: string; // e.g., "Wave Legend"
  className?: string; // container class
  chipClassName?: string; // per-chip class (defaults to "chip")
  activeId?: string; // for aria-selected + initial focus
};

const AccessibleChipRow: React.FC<AccessibleChipRowProps> = ({
  chips,
  ariaLabel,
  className,
  chipClassName = "chip",
  activeId,
}) => {
  // Keep direct refs to each button for reliable focusing
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Initial focus index = active chip if present, else 0
  const [focusIndex, setFocusIndex] = useState<number>(() => {
    const idx = chips.findIndex((c) => c.id === activeId);
    return idx >= 0 ? idx : 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  // If activeId changes, move the roving focus
  useEffect(() => {
    const idx = chips.findIndex((c) => c.id === activeId);
    if (idx >= 0) setFocusIndex(idx);
  }, [activeId, chips]);

  // Focus the current item whenever focusIndex changes
  useEffect(() => {
    const el = itemRefs.current[focusIndex];
    el?.focus();
  }, [focusIndex]);

  const onListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setFocusIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setFocusIndex((i) => Math.min(chips.length - 1, i + 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocusIndex(chips.length - 1);
    }
  };

  const onItemKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    activate: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate();
    }
  };

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={className}
      onKeyDown={onListKeyDown}
    >
      {chips.map((chip, idx) => (
        <button
          key={chip.id}
          type="button"
          ref={(el) => (itemRefs.current[idx] = el)}
          role="option"
          aria-selected={chip.id === activeId}
          aria-label={chip.ariaLabel ?? chip.label}
          className={chipClassName}
          tabIndex={idx === focusIndex ? 0 : -1}
          onClick={chip.onActivate}
          onKeyDown={(e) => onItemKeyDown(e, chip.onActivate)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};

export default AccessibleChipRow;
