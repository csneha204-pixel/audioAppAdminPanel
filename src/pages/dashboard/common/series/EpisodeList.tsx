import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./Series.module.css";
import Topheader from "../topheader/Topheader";

// Dummy data for episodes
const dummyEpisodes = [
  { id: 1, title: "Episode 1: The Beginning", duration: "24 min" },
  { id: 2, title: "Episode 2: The Next Step", duration: "22 min" },
  { id: 3, title: "Episode 3: The Twist", duration: "25 min" },
];

const EpisodeList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const series = location.state?.series || { seriesName: "Unknown Series", id: "" };

  const handleAddEpisode = () => {
    // Go to dashboard, episode tab (index 1), with show preselected
    navigate("/dashboard", { state: { topheaderTab: 1, preselectedShow: series.id } });
  };

  return (
    <>
      <Topheader />
      <div className={styles.seriesForm} style={{ maxWidth: 700, margin: "48px auto 0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 600 }}>{series.seriesName} - Episodes</h2>
          <button className={styles.submitBtn} style={{ minWidth: 140 }} onClick={handleAddEpisode}>
            Add Episode
          </button>
        </div>
        <table style={{ width: "100%", background: "#181818", color: "#fff", borderRadius: 8, overflow: "hidden" }}>
          <thead>
            <tr style={{ background: "#222" }}>
              <th style={{ padding: 12, textAlign: "left" }}>Title</th>
              <th style={{ padding: 12, textAlign: "left" }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {dummyEpisodes.map(ep => (
              <tr key={ep.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: 12 }}>{ep.title}</td>
                <td style={{ padding: 12 }}>{ep.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EpisodeList;