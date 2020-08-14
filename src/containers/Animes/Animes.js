import React, { Component } from 'react';
import Anime from '../../components/Anime/Anime';
import styles from './Animes.module.css';

class Animes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: null
		};
	}

	componentDidMount() {
		fetch('https://kitsu.io/api/edge/anime?filter[text]=one%20piece')
			.then(res => res.json())
			.then(data => {
				this.setState({
					data: data.data.map(item => item.attributes)
				})
			})
			.catch(err => console.error(err));
	}

	render() {
		const animeArray = [];
		if (this.state.data){
			// canonicalTitle, synopsis, averageRating, startDate, ageRating, coverImage.small,
			// coverImage.original, coverImage.large
			console.log(this.state.data);
			
			let i = 0;
			for (const anime of this.state.data) {
				// Destructures the most useful data fields
				const {
					canonicalTitle: title,
					synopsis,
					averageRating,
					startDate,
					ageRating
				} = anime;
				if (anime.posterImage !== null) {
					const {
						posterImage: {
							small: smallImage,
							original: originalImage,
							large: largeImage
						}
					} = anime;
					
					animeArray.push(
						<Anime
							key={i}
							title={title}
							synopsis={synopsis}
							averageRating={averageRating}
							startDate={startDate}
							ageRating={ageRating}
							smallImage={smallImage}
							originalImage={originalImage}
							largeImage={largeImage}
						/>
					);
				}
				i++;
			}
		}
		return (
			<div className={styles['Animes-container']}>
				<input type="text" name="animeName" id="animeName"/>
				{animeArray}
			</div>
		);
	}
};

export default Animes;