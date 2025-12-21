import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [seriesName, setSeriesName] = useState("");
  const [language, setLanguage] = useState<string[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [season, setSeason] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");

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
  // Simulate fetching series data for update
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Handle selecting a pre-saved series for editing
  const handleSelectSeries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSeries(value);
    if (value) {
      // Simulate fetching data for the selected series
      // In real app, fetch from API
      const fakeData = {
        seriesName: "Sample Series",
        image: null,
        language: ["en"],
        genre: ["action"],
        season: "1",
        releaseDate: "2025-12-21",
        description: "This is a sample description for the series.",
        id: value
      };
      setEditData(fakeData);
      setEditMode(true);
    } else {
      setEditMode(false);
      setEditData(null);
    }
  };

  const navigate = useNavigate();

  // Handler for Episode List button
  const handleEpisodeList = () => {
    if (editData && editData.id) {
      navigate(`/dashboard/series/${editData.id}/episodes`, { state: { series: editData } });
    }
  };

  // Handlers for edit form
  const handleEditChange = (field: string, value: any) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setEditData((prev: any) => ({ ...prev, image: files[0] }));
    }
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // handle update submission
    alert("Series updated!");
  };

  return (
    <>
      <div style={{ maxWidth: 600, margin: "0 auto 16px auto", width: "100%", position: "relative" }}>
        <Dropdown
          name="savedSeries"
          label="Pre-saved Series"
          value={selectedSeries}
          onChange={handleSelectSeries}
          options={savedSeriesOptions}
          className={styles.select}
        />
        <FaChevronDown style={{ position: "absolute", right: 10, top: 38, pointerEvents: "none", color: "#aaa" }} />
      </div>
      {editMode && editData ? (
        <form className={styles.seriesForm} onSubmit={handleEditSubmit}>
          <div className={styles.uploadContainer}>
            <label className={styles.uploadCircle} title="Upload Image">
              <FaCloudUploadAlt className={styles.uploadIcon} />
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className={styles.uploadInput}
              />
            </label>
            {editData.image && <span className={styles.fileName}>{typeof editData.image === 'string' ? editData.image : editData.image.name}</span>}
          </div>
          <div className={styles.formRow}>
            <div className={styles.formCol} style={{ width: '100%' }}>
              <label className={styles.label}>Series Name</label>
              <input
                type="text"
                className={styles.input}
                value={editData.seriesName || ''}
                onChange={e => handleEditChange('seriesName', e.target.value)}
                placeholder="Enter series name"
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formCol}>
              <label className={styles.label}>Language</label>
              <MultiSelectDropdown
                options={languageOptions}
                value={editData.language}
                onChange={val => handleEditChange("language", val)}
                placeholder="Please Select"
                className={styles.compactSelect}
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Season</label>
              <input
                type="text"
                value={editData.season}
                onChange={e => handleEditChange("season", e.target.value)}
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
                value={editData.genre}
                onChange={val => handleEditChange("genre", val)}
                placeholder="Please Select"
                className={styles.compactSelect}
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Release Date</label>
              <div className={styles.inputDateWrapper}>
                <input
                  type="date"
                  value={editData.releaseDate}
                  onChange={e => handleEditChange("releaseDate", e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  id="release-date-input-edit"
                  placeholder="Enter Date (DD/MM/YYYY)"
                  style={{ width: '100%' }}
                />
                <FaRegCalendarAlt
                  className={styles.calendarIcon}
                  onClick={() => {
                    const input = document.getElementById("release-date-input-edit");
                    if (input) (input as HTMLInputElement).showPicker && (input as HTMLInputElement).showPicker();
                    else if (input) (input as HTMLInputElement).focus();
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formCol} style={{ width: '100%' }}>
              <label className={styles.label}>Series Description</label>
              <textarea
                className={styles.input}
                style={{ minHeight: 80, resize: 'vertical' }}
                value={editData.description || ''}
                onChange={e => handleEditChange('description', e.target.value)}
                placeholder="Write a description for this series..."
              />
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>Update</button>
            <button type="button" className={styles.submitBtn} style={{ marginLeft: 16, background: '#333', color: '#fff', border: '1px solid #a00' }} onClick={handleEpisodeList}>
              Episode List
            </button>
          </div>
        </form>
      ) : (
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
            <div className={styles.formCol} style={{ width: '100%' }}>
              <label className={styles.label}>Series Name</label>
              <input
                type="text"
                className={styles.input}
                value={seriesName}
                onChange={e => setSeriesName(e.target.value)}
                placeholder="Enter series name"
              />
            </div>
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
              <div className={styles.inputDateWrapper}>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={e => setReleaseDate(e.target.value)}
                  className={`${styles.input} ${styles.inputWithIcon}`}
                  id="release-date-input"
                  placeholder="Enter Date (DD/MM/YYYY)"
                  style={{ width: '100%' }}
                />
                <FaRegCalendarAlt
                  className={styles.calendarIcon}
                  onClick={() => {
                    const input = document.getElementById("release-date-input");
                    if (input) (input as HTMLInputElement).showPicker && (input as HTMLInputElement).showPicker();
                    else if (input) (input as HTMLInputElement).focus();
                  }}
                />
              </div>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formCol} style={{ width: '100%' }}>
              <label className={styles.label}>Series Description</label>
              <textarea
                className={styles.input}
                style={{ minHeight: 80, resize: 'vertical' }}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Write a description for this series..."
              />
            </div>
          </div>
          <div className={styles.submitRow}>
            <button type="submit" className={styles.submitBtn}>Submit</button>
          </div>
        </form>
      )}
    </>
  );
};

export default Series;
