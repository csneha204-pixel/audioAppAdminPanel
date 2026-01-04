import React, { useState, useEffect } from "react";
import styles from "./Series.module.css"; // Reusing Series styles for consistency
import { FaChevronDown } from "react-icons/fa";
import Dropdown from "../../../../components/dropdown/Dropdown";
import { getRequest, postRequest } from "../../../../utils/core-api-functions/coreApiFunctions";
import { URLS } from "../../../../utils/api-endpoints/endpoint";
import { CONFIG } from "../../../../utils/config/config";
import { toast } from "react-toastify";

const Seasons: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState("");
  const [seriesOptions, setSeriesOptions] = useState<{ value: string; label: string }[]>([]);
  const [newSeasonName, setNewSeasonName] = useState("");
  const [seasons, setSeasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.file.series}`);
        if (response && Array.isArray(response)) {
          const options = response.map((s: any) => ({
            value: s.show_id,
            label: s.series_name,
          }));
          setSeriesOptions([{ value: "", label: "Select a Series" }, ...options]);
        }
      } catch (error) {
        console.error("Error fetching series:", error);
        toast.error("Failed to load series");
      }
    };
    fetchSeries();
  }, []);

  const handleSelectSeries = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSeries(value);
    setSeasons([]);
    
    if (value) {
      setLoading(true);
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/file/series/${value}/seasons`);
        if (response && response.seasons && Array.isArray(response.seasons)) {
          setSeasons(response.seasons);
        
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
        toast.error("Failed to load seasons");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddSeason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeries) {
      toast.error("Please select a series first");
      return;
    }
    if (!newSeasonName.trim()) {
      toast.error("Please enter a season name");
      return;
    }
    
    try {
      const payload = {
        season_name: newSeasonName
      };
      const response = await postRequest(`${CONFIG.API_BASE_URL}/file/series/${selectedSeries}/seasons`, payload);
      toast.success(`Season "${newSeasonName}" added successfully!`);
      
      // Refresh seasons list
      const updatedSeasons = await getRequest<any>(`${CONFIG.API_BASE_URL}/file/series/${selectedSeries}/seasons`);
      if (updatedSeasons && updatedSeasons.seasons && Array.isArray(updatedSeasons.seasons)) {
        setSeasons(updatedSeasons.seasons);
      }
      setNewSeasonName("");
    } catch (error: any) {
      console.error("Error adding season:", error);
      toast.error(error.response?.data?.error || "Failed to add season");
    }
  };

  return (
    <div className={styles.seriesForm} style={{ minHeight: 'auto', paddingBottom: '40px' }}>
      <div style={{ width: "100%", position: "relative", marginBottom: '24px' }}>
        <Dropdown
          name="series"
          label="Select Series"
          value={selectedSeries}
          onChange={handleSelectSeries}
          options={seriesOptions}
          className={styles.select}
        />
        <FaChevronDown style={{ position: "absolute", right: 10, top: 38, pointerEvents: "none", color: "#aaa" }} />
      </div>

      {selectedSeries && (
        <div style={{ width: '100%' }}>
          <div className={styles.label} style={{ marginBottom: '12px' }}>Existing Seasons:</div>
          {loading ? (
            <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '24px' }}>Loading seasons...</div>
          ) : seasons.length > 0 ? (
            <ul style={{ color: '#fff', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
              {seasons.map((s, idx) => (
                <li key={s.season_id || idx} style={{ padding: '8px 12px', background: '#191919', border: '1px solid #333', borderRadius: '6px', marginBottom: '8px' }}>
                  {s.season_name} ({s.episodes?.length || 0} episodes)
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ color: '#aaa', fontStyle: 'italic', marginBottom: '24px' }}>No season available</div>
          )}

          <form onSubmit={handleAddSeason} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className={styles.formCol}>
              <label className={styles.label}>Add New Season</label>
              <input
                type="text"
                className={styles.input}
                value={newSeasonName}
                onChange={(e) => setNewSeasonName(e.target.value)}
                placeholder="Enter season name (e.g. Season 1)"
              />
            </div>
            <div className={styles.submitRow} style={{ justifyContent: 'flex-start', marginTop: '8px' }}>
              <button type="submit" className={styles.submitBtn}>Add Season</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Seasons;
