import React, { useEffect, useState } from "react";
import styles from "./Carousels.module.css";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaEdit } from "react-icons/fa";
import { getRequest } from "../../../../utils/core-api-functions/coreApiFunctions";
import { CONFIG } from "../../../../utils/config/config";
import { toast } from "react-toastify";

type CarouselItem = {
  carousel_id: string;
  name: string;
  series: Array<{ series_id: string; details?: any }>;
};

const SavedCarousels: React.FC = () => {
  const [carousels, setCarousels] = useState<CarouselItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarousels = async () => {
      setLoading(true);
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/file/carousels`);
        if (response && Array.isArray(response)) {
          setCarousels(response);
        }
      } catch (error) {
        console.error("Error fetching carousels:", error);
        toast.error("Failed to load carousels");
      } finally {
        setLoading(false);
      }
    };
    fetchCarousels();
  }, []);

  const handleDelete = (id: string) => {
    // No delete API specified; removing locally for now
    setCarousels(carousels.filter(c => c.carousel_id !== id));
  };

  const handleEdit = (carousel: CarouselItem) => {
    navigate("/dashboard", { state: { topheaderTab: 2, preselectedCarousel: carousel.carousel_id } });
  };

  return (
    <div className={styles.carouselForm} style={{ maxWidth: 700, margin: "48px auto 0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Saved Carousels</h2>
      {loading && <div style={{ color: "#aaa" }}>Loading...</div>}
      {!loading && carousels.length === 0 && <div style={{ color: "#aaa" }}>No saved carousels.</div>}
      {carousels.map(carousel => (
        <div key={carousel.carousel_id} style={{ background: "#181818", borderRadius: 8, marginBottom: 24, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#fff" }}>{carousel.name}</div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className={styles.addBtn} style={{ background: "#333", color: "#fff" }} onClick={() => handleEdit(carousel)}>
                <FaEdit /> 
              </button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(carousel.carousel_id)}>
                <FaTimes /> 
              </button>
            </div>
          </div>
          <div style={{ marginTop: 12, color: "#fff" }}>
            <div style={{ fontWeight: 500, marginBottom: 6 }}>Series List:</div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {carousel.series.map((s: any, idx: number) => (
                <li key={s.series_id || idx}>{s.details?.name || s.series_id}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedCarousels;