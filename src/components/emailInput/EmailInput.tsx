import React from "react";
import Input from "../input/Input";
import styles from "./EmailInput.module.css";

interface EmailInputProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, error, onChange, placeholder }) => {

  return (
    <div className={styles["form-group"]}>
      <label className={styles["form-label"]} htmlFor="email">
        Email Address <span className={styles.required}>*</span>
      </label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder={placeholder}
        autoComplete="email"
        value={value}
        onChange={onChange}
        required
      />
      {error && <div className={styles["text-danger"]}>{error}</div>}
    </div>
  );
  
};

export default EmailInput;

