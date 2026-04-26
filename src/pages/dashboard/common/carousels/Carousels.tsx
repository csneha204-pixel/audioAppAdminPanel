
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./Carousels.module.css";
import { getRequest, postRequest } from "../../../../utils/core-api-functions/coreApiFunctions";
import { CONFIG } from "../../../../utils/config/config";
import { URLS } from "../../../../utils/api-endpoints/endpoint";
import { toast } from "react-toastify";


const Carousels: React.FC = () => {
	const [title, setTitle] = useState("");
	const [seriesOptions, setSeriesOptions] = useState<{ value: string; label: string }[]>([{ value: "", label: "Select Series" }]);
	const [selectedSeries, setSelectedSeries] = useState("");
	const [showList, setShowList] = useState<{ id: string; name: string }[]>([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSeries = async () => {
			try {
				const response = await getRequest<any>(`${CONFIG.API_BASE_URL}/${URLS.file.series}`);
				if (response && Array.isArray(response)) {
					const options = response.map((s: any) => ({ value: s.show_id, label: s.series_name }));
					setSeriesOptions([{ value: "", label: "Select Series" }, ...options]);
				}
			} catch (error) {
				console.error("Error fetching series:", error);
				toast.error("Failed to load series");
			}
		};
		fetchSeries();
	}, []);

	const handleAddSeries = () => {
		if (selectedSeries && !showList.find(s => s.id === selectedSeries)) {
			const found = seriesOptions.find(opt => opt.value === selectedSeries);
			setShowList([...showList, { id: selectedSeries, name: found?.label || selectedSeries }]);
			setSelectedSeries("");
		}
	};

	const handleDeleteSeries = (seriesValue: string) => {
		setShowList(showList.filter(s => s.id !== seriesValue));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) {
			toast.error("Please enter a carousel title");
			return;
		}
		if (showList.length === 0) {
			toast.error("Please add at least one series");
			return;
		}

		setLoading(true);
		try {
			await postRequest(
				`${CONFIG.API_BASE_URL}/file/carousels`,
				{
					name: title,
					series_ids: showList.map(s => s.id),
				},
			);
			toast.success("Carousel created successfully!");
			setTitle("");
			setShowList([]);
		} catch (error: any) {
			console.error("Error creating carousel:", error);
			toast.error(error.response?.data?.error || "Failed to create carousel");
		} finally {
			setLoading(false);
		}
	};

	const handleSavedCarousels = () => {
		navigate("/dashboard/carousels/saved");
	};

	return (
		<>
			<div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
				<button type="button" className={styles.addBtn} style={{ minWidth: 160, fontWeight: 600 }} onClick={handleSavedCarousels}>
					Saved Carousels
				</button>
			</div>
			<form className={styles.carouselForm} onSubmit={handleSubmit}>
				<div className={styles.formRow}>
					<div className={styles.formCol}>
						<label className={styles.label}>Carousel Title</label>
						<input
							type="text"
							className={styles.input}
							value={title}
							onChange={e => setTitle(e.target.value)}
							placeholder="Enter carousel title"
						/>
					</div>
				</div>
				<div className={styles.formRow}>
					<div className={styles.formCol}>
						<label className={styles.label}>Add Series to Carousel</label>
						<div style={{ display: "flex", gap: 12 }}>
							<select
								className={styles.select}
								value={selectedSeries}
								onChange={e => setSelectedSeries(e.target.value)}
							>
								{seriesOptions.map(opt => (
									<option
										key={opt.value}
										value={opt.value}
										disabled={!!opt.value && showList.some(s => s.id === opt.value)}
									>
										{opt.label}
									</option>
								))}
							</select>
							<button
								type="button"
								className={styles.addBtn}
								onClick={handleAddSeries}
								disabled={!selectedSeries}
							>
								Add
							</button>
						</div>
					</div>
				</div>
				<div className={styles.showListSection}>
					<div className={styles.showListHeading}>Carousel Show List</div>
					<div className={styles.showList}>
						{showList.length === 0 && <span className={styles.emptyList}>No series added yet.</span>}
						{showList.map((series, idx) => (
							<div className={styles.showListItem} key={series.id}>
								<span className={styles.showListIndex}>{idx + 1}.</span> {series.name}
								<button
									type="button"
									className={styles.deleteBtn}
									title="Remove"
									onClick={() => handleDeleteSeries(series.id)}
								>
									<FaTimes />
								</button>
							</div>
						))}
					</div>
				   </div>
				   <div className={styles.submitRow}>
					   <button type="submit" className={styles.submitBtn} disabled={loading}>
					   	{loading ? "Submitting..." : "Submit"}
					   </button>
				   </div>
			   </form>
		   </>
	   );
	};
export default Carousels;
