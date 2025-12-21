import React, { useState } from "react";
import styles from "./Carousels.module.css";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEdit } from "react-icons/fa";

// Dummy data for saved carousels
const dummyCarousels = [
  {
    id: "carousel1",
    title: "Action Hits",
    series: ["Avengers", "Batman"]
  },
  {
    id: "carousel2",
    title: "Superheroes",
    series: ["Superman", "Spiderman"]
  }
];

const SavedCarousels: React.FC = () => {
  const [carousels, setCarousels] = useState(dummyCarousels);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setCarousels(carousels.filter(c => c.id !== id));
  };

  const handleEdit = (carousel: any) => {
    // Go to dashboard, carousels tab, with carousel preselected (dummy logic)
    navigate("/dashboard", { state: { topheaderTab: 2, preselectedCarousel: carousel.id } });
  };

  return (
    <div className={styles.carouselForm} style={{ maxWidth: 700, margin: "48px auto 0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Saved Carousels</h2>
      {carousels.length === 0 && <div style={{ color: "#aaa" }}>No saved carousels.</div>}
      {carousels.map(carousel => (
        <div key={carousel.id} style={{ background: "#181818", borderRadius: 8, marginBottom: 24, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{carousel.title}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className={styles.addBtn} style={{ background: "#333", color: "#fff" }} onClick={() => handleEdit(carousel)}>
                <FaEdit /> 
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(carousel.id)}>
                <FaTimes /> 
              </button>
            </div>
          </div>
          <div style={{ marginTop: 12, color: "#fff" }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Series List:</div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {carousel.series.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedCarousels;