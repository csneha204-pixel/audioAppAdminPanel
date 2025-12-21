import React, { useState } from "react";
import styles from "./Index.module.css";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import Topheader from "./common/topheader/Topheader";
import { Routes, Route } from "react-router-dom";
import EpisodeList from "./common/series/EpisodeList";
// import SavedCarousels from "./common/carousels/SavedCarousels";
import SavedCarousels from "./common/carousels/SavedCarousels";

const Dashboard: React.FC = () => {
  // 0: Enter Details, 1: Analytics
  const [selectedMenu, setSelectedMenu] = useState(0);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar onMenuSelect={setSelectedMenu} selectedMenu={selectedMenu} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Routes>
          <Route
            path="/series/:id/episodes"
            element={<EpisodeList />}
          />
          <Route
            path="/carousels/saved"
            element={<SavedCarousels />}
          />
          <Route
            index
            element={
              <>
                {selectedMenu === 0 && <Topheader />}
                <div className={styles.dashboardMain}></div>
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
