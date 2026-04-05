import React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const buttonClass =
    variant === "secondary"
      ? styles["secondary-button"]
      : styles["submit-button"];
  return (
    <button className={`${buttonClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};

export default Button;
