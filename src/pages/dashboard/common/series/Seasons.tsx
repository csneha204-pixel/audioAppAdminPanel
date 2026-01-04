import React, { useState } from "react";
import styles from "./Series.module.css"; // Reusing Series styles for consistency
import { FaChevronDown } from "react-icons/fa";
import Dropdown from "../../../../components/dropdown/Dropdown";

const seriesOptions = [
  { value: "", label: "Select a Series" },
  { value: "avengers", label: "Avengers" },
  { value: "batman", label: "Batman" },
  { value: "superman", label: "Superman" },
];

// Dummy data for seasons
const seasonsData: Record<string, string[]> = {
  avengers: ["Season 1", "Season 2"],
  batman: ["Season 1"],
  superman: [], // No seasons
};

const Seasons: React.FC = () => {
  const [selectedSeries, setSelectedSeries] = useState("");
  const [newSeasonName, setNewSeasonName] = useState("");
  const [seasons, setSeasons] = useState<string[]>([]);

  const handleSelectSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSeries(value);
    if (value) {
      setSeasons(seasonsData[value] || []);
    } else {
      setSeasons([]);
    }
  };

  const handleAddSeason = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSeries) {
      alert("Please select a series first");
      return;
    }
    if (!newSeasonName.trim()) {
      alert("Please enter a season name");
      return;
    }
    
    // In a real app, this would be an API call
    setSeasons([...seasons, newSeasonName]);
    setNewSeasonName("");
    alert(`Season "${newSeasonName}" added to ${selectedSeries}`);
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
          {seasons.length > 0 ? (
            <ul style={{ color: '#fff', listStyle: 'none', padding: 0, marginBottom: '24px' }}>
              {seasons.map((s, idx) => (
                <li key={idx} style={{ padding: '8px 12px', background: '#191919', border: '1px solid #333', borderRadius: '6px', marginBottom: '8px' }}>
                  {s}
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
