import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../../../../components/dropdown/Dropdown";
import { FaChevronDown, FaRegCalendarAlt } from "react-icons/fa";
import styles from "./Series.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { getRequest, postRequest, putRequest } from "../../../../utils/core-api-functions/coreApiFunctions";
import { URLS } from "../../../../utils/api-endpoints/endpoint";
import { CONFIG } from "../../../../utils/config/config";
import { toast } from "react-toastify";

const Series: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [seriesName, setSeriesName] = useState("");
  const [language, setLanguage] = useState("");
  const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
  const [seriesOptions, setSeriesOptions] = useState<{ value: string; label: string }[]>([]);
  const [genre, setGenre] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.file.languages}`);
        if (response && Array.isArray(response)) {
          const options = response.map((lang: any) => ({
            value: lang._id || lang.language_id,
            label: lang.name,
          }));
          setLanguages([{ value: "", label: "Select Language" }, ...options]);
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
        toast.error("Failed to load languages");
      }
    };

    const fetchSeries = async () => {
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.file.series}`);
        if (response && Array.isArray(response)) {
          const options = response.map((s: any) => ({
            value: s.show_id,
            label: s.series_name,
          }));
          setSeriesOptions([{ value: '', label: 'Select a Series' }, ...options]);
        }
      } catch (error) {
        console.error('Error fetching series:', error);
        toast.error('Failed to load series');
      }
    };

    fetchLanguages();
    fetchSeries();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image || !seriesName || !genre || !language || !description || !releaseDate) {
      toast.error("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("series_name", seriesName);
    // Split genres by comma and trim whitespace
    const genresArray = genre.split(",").map(g => g.trim()).filter(g => g !== "");
    genresArray.forEach(g => formData.append("genres[]", g));
    formData.append("language_id", language);
    formData.append("description", description);
    formData.append("release_date", releaseDate);

    try {
      await postRequest(`${CONFIG.API_BASE_URL}/${URLS.file.series}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Series created successfully!");
      // Reset form
      setImage(null);
      setSeriesName("");
      setLanguage("");
      setGenre("");
      setReleaseDate("");
      setDescription("");
    } catch (error: any) {
      console.error("Error creating series:", error);
      toast.error(error.response?.data?.error || "Error creating series");
    }
  };

  const [selectedSeries, setSelectedSeries] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  // Handle selecting a pre-saved series for editing
  const handleSelectSeries = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSeries(value);
    setImageLoadError(false);
    if (value) {
      try {
        const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.file.series}/${value}`);
        if (response) {
          const imageData = response.url || response.image || response.image_url || response.file || response.thumbnail;
          setEditData({
            seriesName: response.series_name || response.name,
            image: imageData,
            language_id: response.language_id,
            genre: response.genres ? response.genres.join(", ") : "",
            releaseDate: response.release_date ? response.release_date.split('T')[0] : "",
            description: response.description,
            id: response.show_id
          });
          setEditMode(true);
        }
      } catch (error) {
        console.error("Error fetching series details:", error);
        toast.error("Failed to load series details");
      }
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
      setImageLoadError(false);
      setEditData((prev: any) => ({ ...prev, image: files[0] }));
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;
    try {
      const updatePayload: any = {
        series_name: editData.seriesName,
        language_id: editData.language_id,
        description: editData.description,
        release_date: editData.releaseDate,
      };
      if (editData.genre) {
        updatePayload.genres = editData.genre.split(',').map((g: string) => g.trim()).filter(Boolean);
      }
      await putRequest(
        `${CONFIG.API_BASE_URL}/${URLS.file.series}/${editData.id}`,
        updatePayload
      );
      toast.success('Series updated successfully!');
    } catch (error: any) {
      console.error('Error updating series:', error);
      toast.error(error.response?.data?.error || 'Error updating series');
    }
  };

  return (
    <>
      <div style={{ maxWidth: 600, margin: "0 auto 16px auto", width: "100%", position: "relative" }}>
        <Dropdown
          name="savedSeries"
          label="Pre-saved Series"
          value={selectedSeries}
          onChange={handleSelectSeries}
          options={seriesOptions}
          className={styles.select}
        />
        <FaChevronDown style={{ position: "absolute", right: 10, top: 38, pointerEvents: "none", color: "#aaa" }} />
      </div>
      {editMode && editData ? (
        <form className={styles.seriesForm} onSubmit={handleEditSubmit}>
          <div className={styles.uploadContainer}>
            <label className={styles.uploadCircle} title="Upload Image">
              {editData.image && !imageLoadError ? (
                typeof editData.image === 'string' ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      backgroundImage: `url(${editData.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                    onError={() => {
                      console.error("Failed to load image from:", editData.image);
                      setImageLoadError(true);
                    }}
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(editData.image)}
                    alt="Series Preview"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                )
              ) : (
                <FaCloudUploadAlt className={styles.uploadIcon} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                className={styles.uploadInput}
              />
            </label>
            {editData.image && <span className={styles.fileName}>{typeof editData.image === 'string' ? 'Current Image' : editData.image.name}</span>}
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
              <Dropdown
                name="language"
                value={editData.language_id || ""}
                onChange={e => handleEditChange("language_id", e.target.value)}
                options={languages}
                className={styles.compactSelect}
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Genres</label>
              <input
                type="text"
                className={styles.input}
                value={editData.genre || ''}
                onChange={e => handleEditChange('genre', e.target.value)}
                placeholder="Enter genres (comma separated)"
              />
            </div>
          </div>
          <div className={styles.formRow}>
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
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                />
              ) : (
                <FaCloudUploadAlt className={styles.uploadIcon} />
              )}
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
              <Dropdown
                name="language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                options={languages}
                className={styles.compactSelect}
              />
            </div>
            <div className={styles.formCol}>
              <label className={styles.label}>Genres</label>
              <input
                type="text"
                className={styles.input}
                value={genre}
                onChange={e => setGenre(e.target.value)}
                placeholder="Enter genres (comma separated)"
              />
            </div>
          </div>
          <div className={styles.formRow}>
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
