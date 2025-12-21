import React from "react";
import styles from "./Header.module.css";
import { FaUserCircle } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className={styles.headerBar}>
      <div className={styles.spacer}></div>
      <FaUserCircle className={styles.userIcon} />
    </header>
  );
};

export default Header;
