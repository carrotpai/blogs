import React from 'react';

import styles from './recommendation.module.scss';
import { useLocation, useNavigate } from 'react-router';

interface IRecommendationCardProps {
	image: string;
	title: string;
	author: string;
}

function RecommendationCard({
	image,
	title,
	author,
}: IRecommendationCardProps) {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div className={styles.card}>
			<img
				src={image}
				alt={`blog post ${title} ${author}`}
				width={220}
				height={320}
			/>
			<p className={styles.card__title}>{title}</p>
			<span
				className={styles.card__author}
				onClick={() => {
					navigate('/user/1', { state: { background: pathname } });
				}}
			>
				{author}
			</span>
		</div>
	);
}

export default RecommendationCard;
