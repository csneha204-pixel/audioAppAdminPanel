
import React, { useState, useEffect } from "react";
import styles from "./Episodes.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";
import { getRequest, postRequest } from "../../../../utils/core-api-functions/coreApiFunctions";
import { URLS } from "../../../../utils/api-endpoints/endpoint";
import { CONFIG } from "../../../../utils/config/config";
import { toast } from "react-toastify";

interface EpisodesProps {
	preselectedShow?: string;
}

const Episodes: React.FC<EpisodesProps> = ({ preselectedShow }) => {
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [seriesOptions, setSeriesOptions] = useState<{ value: string; label: string }[]>([]);
	const [seasonOptions, setSeasonOptions] = useState<{ value: string; label: string; name: string }[]>([]);
	const [series, setSeries] = useState(preselectedShow || "");
	const [season, setSeason] = useState("");
	const [episodeNumber, setEpisodeNumber] = useState("");
	const [episodeName, setEpisodeName] = useState("");
	const [audio, setAudio] = useState<File | null>(null);
	const [duration, setDuration] = useState("");
	const [loading, setLoading] = useState(false);

	// Fetch all series on mount
	useEffect(() => {
		const fetchSeries = async () => {
			try {
				const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/file/series`);
				if (response && Array.isArray(response)) {
					const options = response.map((s: any) => ({
						value: s.show_id,
						label: s.series_name,
					}));
					setSeriesOptions([{ value: "", label: "Select Series" }, ...options]);
				}
			} catch (error) {
				console.error("Error fetching series:", error);
				toast.error("Failed to load series");
			}
		};
		fetchSeries();
	}, []);

	// Fetch seasons when series is selected
	useEffect(() => {
		const fetchSeasons = async () => {
			if (!series) {
				setSeasonOptions([{ value: "", label: "Select Season", name: "" }]);
				setSeason("");
				return;
			}

			try {
				const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/file/series/${series}/seasons`);
				if (response && response.seasons && Array.isArray(response.seasons)) {
					const options = response.seasons.map((s: any) => ({
						value: s.season_id,
						label: s.season_name,
						name: s.season_name
					}));
					setSeasonOptions([{ value: "", label: "Select Season", name: "" }, ...options]);
				} else {
					setSeasonOptions([{ value: "", label: "No seasons available", name: "" }]);
				}
			} catch (error) {
				console.error("Error fetching seasons:", error);
				toast.error("Failed to load seasons");
				setSeasonOptions([{ value: "", label: "Select Season", name: "" }]);
			}
		};
		fetchSeasons();
	}, [series]);

	// If preselectedShow changes (e.g., via navigation), update the series
	useEffect(() => {
		if (preselectedShow) setSeries(preselectedShow);
	}, [preselectedShow]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!series || !season || !episodeNumber || !episodeName || !audio || !duration) {
			toast.error("All fields except thumbnail are required.");
			return;
		}

		const formData = new FormData();
		if (thumbnail) {
			formData.append("image", thumbnail);
		}
		formData.append("audio", audio);
		formData.append("episode_no", episodeNumber);
		formData.append("episode_name", episodeName);
		formData.append("duration", duration);

		setLoading(true);
		try {
			await postRequest(
				`${CONFIG.API_BASE_URL}/file/series/${series}/seasons/${season}/episodes`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			toast.success("Episode created successfully!");
			// Reset form
			setThumbnail(null);
			setEpisodeNumber("");
			setEpisodeName("");
			setAudio(null);
			setDuration("");
		} catch (error: any) {
			console.error("Error creating episode:", error);
			toast.error(error.response?.data?.error || "Error creating episode");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form className={styles.episodeForm} onSubmit={handleSubmit}>
			<div className={styles.uploadContainer}>
				<label className={styles.uploadCircle} title="Upload Thumbnail (Optional)">
					{thumbnail ? (
						<img
							src={URL.createObjectURL(thumbnail)}
							alt="Thumbnail Preview"
							style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
						/>
					) : (
						<FaCloudUploadAlt className={styles.uploadIcon} />
					)}
					<input
						type="file"
						accept="image/*"
						onChange={e => e.target.files && setThumbnail(e.target.files[0])}
						className={styles.uploadInput}
					/>
				</label>
				{thumbnail && <span className={styles.fileName}>{thumbnail.name}</span>}
			</div>
			<div className={styles.formRow}>
				<div className={styles.formCol}>
					<label className={styles.label}>Series Name</label>
					<select
						className={styles.select}
						value={series}
						onChange={e => setSeries(e.target.value)}
					>
						{seriesOptions.map(opt => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
				<div className={styles.formCol}>
					<label className={styles.label}>Season</label>
					<select
						className={styles.select}
						value={season}
						onChange={e => setSeason(e.target.value)}
					>
						{seasonOptions.map(opt => (
							<option key={opt.value} value={opt.value}>{opt.label}</option>
						))}
					</select>
				</div>
			</div>
			<div className={styles.formRow}>
				<div className={styles.formCol}>
					<label className={styles.label}>Episode Number</label>
					<input
						type="number"
						className={styles.input}
						value={episodeNumber}
						onChange={e => setEpisodeNumber(e.target.value)}
						placeholder="Episode Number"
						min={1}
					/>
				</div>
				<div className={styles.formCol}>
					<label className={styles.label}>Episode Name</label>
					<input
						type="text"
						className={styles.input}
						value={episodeName}
						onChange={e => setEpisodeName(e.target.value)}
						placeholder="Episode Name"
					/>
				</div>
			</div>
			<div className={styles.formRow}>
				<div className={styles.formCol}>
					<label className={styles.label}>Episode Audio</label>
					<label className={styles.audioUploadBox}>
						<span>{audio ? audio.name : "Upload .mp3, .wav"}</span>
						<input
							type="file"
							accept="audio/mp3,audio/wav"
							onChange={e => e.target.files && setAudio(e.target.files[0])}
							className={styles.uploadInput}
						/>
					</label>
				</div>
				<div className={styles.formCol}>
					<label className={styles.label}>Duration</label>
					<input
						type="text"
						className={styles.input}
						value={duration}
						onChange={e => setDuration(e.target.value)}
						placeholder="e.g. 45:00"
					/>
				</div>
			</div>
			<div className={styles.submitRow}>
				<button type="submit" className={styles.submitBtn} disabled={loading}>
					{loading ? "Submitting..." : "Submit"}
				</button>
			</div>
		</form>
	);
};

export default Episodes;
