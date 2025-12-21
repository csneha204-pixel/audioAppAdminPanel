
import React, { useState } from "react";
import styles from "./Episodes.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";

const seriesOptions = [
	{ value: "", label: "Select Series" },
	{ value: "avengers", label: "Avengers" },
	{ value: "batman", label: "Batman" },
	{ value: "superman", label: "Superman" },
];

const seasonOptions = [
	{ value: "", label: "Select Season" },
	{ value: "1", label: "Season 1" },
	{ value: "2", label: "Season 2" },
	{ value: "3", label: "Season 3" },
];

const Episodes: React.FC = () => {
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [series, setSeries] = useState("");
	const [season, setSeason] = useState("");
	const [episodeNumber, setEpisodeNumber] = useState("");
	const [episodeName, setEpisodeName] = useState("");
	const [audio, setAudio] = useState<File | null>(null);
	const [duration, setDuration] = useState("");

	return (
		<form className={styles.episodeForm}>
			<div className={styles.uploadContainer}>
				<label className={styles.uploadCircle} title="Upload Thumbnail">
					<FaCloudUploadAlt className={styles.uploadIcon} />
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
				<button type="submit" className={styles.submitBtn}>Submit</button>
			</div>
		</form>
	);
};

export default Episodes;
