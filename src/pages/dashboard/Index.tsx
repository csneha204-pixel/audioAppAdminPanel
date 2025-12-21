import React from "react";
import styles from "./Index.module.css";

import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Topheader from "./common/topheader/Topheader";
import { useState } from "react";

const Dashboard: React.FC = () => {
  // 0: Enter Details, 1: Analytics
  const [selectedMenu, setSelectedMenu] = useState(0);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        {selectedMenu === 0 && <Topheader />}
        <div className={styles.dashboardMain}>
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
