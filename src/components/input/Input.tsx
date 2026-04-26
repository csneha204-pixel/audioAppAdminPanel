import React, { forwardRef } from "react";
import styles from "./Input.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`${styles["form-input"]} ${className}`.trim()}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
