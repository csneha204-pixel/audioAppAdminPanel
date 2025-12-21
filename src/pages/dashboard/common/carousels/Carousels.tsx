
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./Carousels.module.css";

const seriesOptions = [
	{ value: "", label: "Select Series" },
	{ value: "avengers", label: "Avengers" },
	{ value: "batman", label: "Batman" },
	{ value: "superman", label: "Superman" },
];

const Carousels: React.FC = () => {
	const [title, setTitle] = useState("");
	const [selectedSeries, setSelectedSeries] = useState("");
	const [showList, setShowList] = useState<string[]>([]);

	const handleAddSeries = () => {
		if (selectedSeries && !showList.includes(selectedSeries)) {
			setShowList([...showList, selectedSeries]);
			setSelectedSeries("");
		}
	};

	const handleDeleteSeries = (seriesValue: string) => {
		setShowList(showList.filter(s => s !== seriesValue));
	};

	return (
		<form className={styles.carouselForm} onSubmit={e => e.preventDefault()}>
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
									disabled={!!opt.value && showList.includes(opt.value)}
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
						<div className={styles.showListItem} key={series}>
							<span className={styles.showListIndex}>{idx + 1}.</span> {seriesOptions.find(opt => opt.value === series)?.label || series}
							<button
								type="button"
								className={styles.deleteBtn}
								title="Remove"
								onClick={() => handleDeleteSeries(series)}
							>
								<FaTimes />
							</button>
						</div>
					))}
				</div>
			</div>
			<div className={styles.submitRow}>
				<button type="submit" className={styles.submitBtn}>Submit</button>
			</div>
		</form>
	);
};

export default Carousels;
