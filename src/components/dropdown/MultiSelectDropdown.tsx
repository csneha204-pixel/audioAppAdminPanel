import React, { useState, useRef, useEffect } from "react";
import styles from "./MultiSelectDropdown.module.css";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  className = "",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const selectedLabels = options.filter(opt => value.includes(opt.value)).map(opt => opt.label);

  return (
    <div className={`${styles.multiSelect} ${className}`} ref={ref}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        className={styles.control}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setOpen(o => !o); }}
      >
        <span className={styles.value}>
          {selectedLabels.length > 0 ? selectedLabels.join(", ") : <span className={styles.placeholder}>{placeholder}</span>}
        </span>
        <span className={styles.chevron}>&#9662;</span>
      </div>
      {open && (
        <div className={styles.dropdown}>
          {options.map(opt => (
            <label key={opt.value} className={styles.option}>
              <input
                type="checkbox"
                checked={value.includes(opt.value)}
                onChange={() => handleOptionClick(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
