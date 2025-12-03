import { useEffect, useMemo, useRef, useState } from "react";
import { Code2Icon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";
import { LoaderIcon } from "react-hot-toast";

// ---- Headless, keyboard-accessible Select ----
function SimpleSelect({ value, onChange, options, renderLabel }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const wrapRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const onDown = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Close on Esc
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Ensure active item stays in view when navigating
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const selectedLabel = useMemo(() => {
    const opt = options.find((o) => o.value === value);
    return opt ? renderLabel(opt) : "Choose a coding problem...";
  }, [options, value, renderLabel]);

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) {
        const opt = options[activeIndex];
        onChange(opt);
        setOpen(false);
        btnRef.current?.focus();
      }
    } else if (e.key === "Tab") {
      // Let focus move naturally, but close the menu
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((v) => {
            const next = !v;
            if (next) {
              setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
            }
            return next;
          });
        }}
        onKeyDown={handleKeyDown}
        className="
          w-full text-left
          bg-base-100 border border-base-300 rounded-lg
          px-4 py-3
          text-base-content
          hover:border-base-400
          focus:outline-none focus:ring-2 focus:ring-primary
          transition shadow-sm
        "
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{selectedLabel}</span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Popover */}
      {open && (
        <div
          role="listbox"
          aria-activedescendant={activeIndex >= 0 ? `opt-${activeIndex}` : undefined}
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          ref={listRef}
          className="
            absolute z-[100] mt-2 w-full
            bg-base-100 border border-base-300 rounded-lg shadow-lg
            max-h-60 overflow-y-auto overflow-x-hidden
          "
        >
          {options.map((opt, idx) => {
            const isActive = idx === activeIndex;
            const isSelected = opt.value === value;
            return (
              <button
                id={`opt-${idx}`}
                data-idx={idx}
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={`
                  w-full text-left px-4 py-2
                  ${isActive ? "bg-base-200" : ""}
                  ${isSelected ? "bg-base-300" : "hover:bg-base-200"}
                  whitespace-normal
                `}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  // Pick before focus changes to avoid re-open flicker
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
              >
                {renderLabel(opt)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- Your modal, using SimpleSelect ----
function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = useMemo(() => Object.values(PROBLEMS), []);

  if (!isOpen) return null;

  const options = problems.map((p) => ({
    value: p.title,
    difficulty: p.difficulty,
    raw: p,
  }));

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* Problem selection */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <SimpleSelect
              value={roomConfig.problem}
              options={options}
              onChange={(opt) => {
                setRoomConfig({
                  difficulty: opt.difficulty.toLowerCase(),
                  problem: opt.value,
                });
              }}
              renderLabel={(opt) => (
                <span className="flex items-center gap-2">
                  <span className="truncate">{opt.value}</span>
                  <span className="opacity-60">({opt.difficulty})</span>
                </span>
              )}
            />
          </div>

          {/* Summary */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? <LoaderIcon className="size-5 animate-spin" /> : <PlusIcon className="size-5" />}
            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}

export default CreateSessionModal;
