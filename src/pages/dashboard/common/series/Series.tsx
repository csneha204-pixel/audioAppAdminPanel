import React, { useState } from "react";

import Dropdown from "../../../../components/dropdown/Dropdown";
import MultiSelectDropdown from "../../../../components/dropdown/MultiSelectDropdown";
import { FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import styles from "./Series.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const languageOptions = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
];

const genreOptions = [
  { value: "action", label: "Action" },
  { value: "drama", label: "Drama" },
  { value: "comedy", label: "Comedy" },
  { value: "sci-fi", label: "Sci-Fi" },
];

const Series: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [language, setLanguage] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [season, setSeason] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // For Dropdown multi-select, handle as comma-separated string
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setLanguage(selected);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setGenre(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle form submission
    alert("Submitted!");
  };

  // Dummy data for previously saved series
  const savedSeriesOptions = [
    { value: "", label: "Select a Series" },
    { value: "avengers", label: "Avengers" },
    { value: "batman", label: "Batman" },
    { value: "superman", label: "Superman" },
    { value: "spiderman", label: "Spiderman" },
  ];
  const [selectedSeries, setSelectedSeries] = useState("");

  return (
    <>
      <div style={{ maxWidth: 600, margin: "0 auto 16px auto", width: "100%", position: "relative" }}>
        <Dropdown
          name="savedSeries"
          label="Pre-saved Series"
          value={selectedSeries}
          onChange={e => setSelectedSeries(e.target.value)}
          options={savedSeriesOptions}
          className={styles.select}
        />
        <FaChevronDown style={{ position: "absolute", right: 10, top: 38, pointerEvents: "none", color: "#aaa" }} />
      </div>
      <form className={styles.seriesForm} onSubmit={handleSubmit}>
        <div className={styles.uploadContainer}>
          <label className={styles.uploadCircle} title="Upload Image">
            <FaCloudUploadAlt className={styles.uploadIcon} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.uploadInput}
            />
          </label>
          {image && <span className={styles.fileName}>{image.name}</span>}
        </div>
        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label className={styles.label}>Language</label>
            <MultiSelectDropdown
              options={languageOptions}
              value={language}
              onChange={setLanguage}
              placeholder="Please Select"
              className={styles.compactSelect}
            />
          </div>
          <div className={styles.formCol}>
            <label className={styles.label}>Season</label>
            <input
              type="text"
              value={season}
              onChange={e => setSeason(e.target.value)}
              className={styles.input}
              placeholder="Season"
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formCol}>
            <label className={styles.label}>Genres</label>
            <MultiSelectDropdown
              options={genreOptions}
              value={genre}
              onChange={setGenre}
              placeholder="Please Select"
              className={styles.compactSelect}
            />
          </div>
          <div className={styles.formCol}>
            <label className={styles.label}>Release Date</label>
            <div style={{ position: "relative" }}>
              <input
                type="date"
                value={releaseDate}
                onChange={e => setReleaseDate(e.target.value)}
                className={styles.input}
                style={{ paddingRight: 32 }}
                id="release-date-input"
              />
              <FaRegCalendarAlt
                style={{ position: "absolute", right: 10, top: 14, pointerEvents: "auto", color: "#aaa", cursor: "pointer" }}
                onClick={() => {
                  const input = document.getElementById("release-date-input");
                  if (input) (input as HTMLInputElement).showPicker && (input as HTMLInputElement).showPicker();
                  else if (input) (input as HTMLInputElement).focus();
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.submitRow}>
          <button type="submit" className={styles.submitBtn}>Submit</button>
        </div>
      </form>
    </>
  );
};

export default Series;
