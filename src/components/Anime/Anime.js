import React from 'react';
import styles from './Anime.module.css';

const Anime = (props) => {
	const {
		title,
		synopsis,
		averageRating,
		startDate,
		ageRating,
		smallImage,
		originalImage,
		largeImage
	} = props;
	return (
		<div className={styles['Anime-container']}>
			<img
				src={largeImage}
				alt="largeImage"
				id={styles['anime-img']}
				/>
			
			<div className={styles["Anime-text-container"]}>
				<div>
					<p>Anime Name: {title}</p>
					<p>Synopsis: {synopsis}</p>
					<p>Rating: {averageRating}</p>
					<p>Start Date: {startDate}</p>
					<p>Age Rating: {ageRating}</p>
				</div>
			</div>
		</div>
	);
};

export default Anime;