import React, { useState } from "react";
import Input from "../input/Input";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import styles from "../../pages/sign-in/SignInPage.module.css";
import styles from "./PasswordInput.module.css";

interface PasswordInputProps {
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  placeholder: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, error, onChange, text, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      togglePassword();
    }
  };

  return (
    <div className={`${styles["form-group"]} ${styles["password-group"]}`}>
      <label className={styles["form-label"]} htmlFor="password">
        {text} <span className={styles.required}>*</span>
      </label>
      <div className={styles["password-wrapper"]}>
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          required
        />
        <span
          className={styles["toggle-password"]}
          role="button"
          aria-label="Toggle password visibility"
          tabIndex={0}
          onClick={togglePassword}
          onKeyDown={handleKeyPress}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {error && <div className={styles["text-danger"]}>{error}</div>}
    </div>
  );
};

export default PasswordInput;
