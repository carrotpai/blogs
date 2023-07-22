import React from 'react';

import arrow from '../../assets/arrow.svg';

import styles from './voteCount.module.scss';

interface VoteCountProps {
	rating: number;
}

function VoteCount({ rating }: VoteCountProps) {
	return (
		<div className={styles.rating}>
			<button type="button" className={styles.upvote}>
				{/* <img src={arrow} alt='arrow' /> */}
			</button>
			<span className={styles.text}>{rating}</span>
			<button type="button" className={styles.downvote}>
				{/* <img src={arrow} alt='arrow' /> */}
			</button>
		</div>
	);
}

export default VoteCount;
