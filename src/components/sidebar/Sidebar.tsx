import React from "react";
import styles from "./Sidebar.module.css";
import {  FaPen } from "react-icons/fa";
import { TbDeviceAnalytics } from "react-icons/tb";

interface SidebarProps {
  onMenuSelect?: (idx: number) => void;
  selectedMenu?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ onMenuSelect, selectedMenu = 0 }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoBar}>
        <span className={styles.logo}>LOGO</span>
      </div>
      <div className={styles.menu}>
        <div
          className={styles.menuItem + (selectedMenu === 0 ? " " + styles.active : "")}
          onClick={() => onMenuSelect && onMenuSelect(0)}
        >
          <FaPen className={styles.menuIcon} />
          <span className={styles.menuText}>ENTER DETAILS</span>
        </div>
        <div
          className={styles.menuItem + (selectedMenu === 1 ? " " + styles.active : "")}
          onClick={() => onMenuSelect && onMenuSelect(1)}
        >
          <TbDeviceAnalytics className={styles.menuIcon} />
          <span className={styles.menuText}>Analytics</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
