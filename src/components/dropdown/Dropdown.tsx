import React from "react";
import styles from "./Dropdown.module.css";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  className = "",
  error,
  disabled = false,
}) => (
  <div className={`${styles.dropdownGroup}`}>
    {label && (
      <label htmlFor={name} className={styles.dropdownLabel}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`${styles.dropdownSelect} ${className}`}
      disabled={disabled}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <div className={styles.error}>{error}</div>}
  </div>
);

export default Dropdown;
