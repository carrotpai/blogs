import React from 'react';

import styles from './voteCount.module.scss';
import { useUserStore } from '../../store/store';
import { useLocation, useNavigate } from 'react-router';

interface VoteCountProps {
	upvoteFn: () => void;
	downvoteFn: () => void;
	rating: number;
	status?: number;
}

function VoteCount({ rating, upvoteFn, downvoteFn, status }: VoteCountProps) {
	const user = useUserStore((state) => state.user);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	return (
		<div className={styles.rating}>
			<button
				type="button"
				className={`${styles.upvote} ${
					status && status > 0 && styles.upvote__active
				}`}
				onClick={() => {
					if (user) {
						upvoteFn();
					} else {
						navigate('auth', {
							state: {
								background: pathname,
							},
						});
					}
				}}
			>
				{/* <img src={arrow} alt='arrow' /> */}
			</button>
			<span className={styles.text}>{rating}</span>
			<button
				type="button"
				className={`${styles.downvote} ${
					status && status < 0 && styles.downvote__active
				}`}
				onClick={() => {
					if (user) {
						downvoteFn();
					} else {
						navigate('auth', {
							state: {
								background: pathname,
							},
						});
					}
				}}
			>
				{/* <img src={arrow} alt='arrow' /> */}
			</button>
		</div>
	);
}

export default VoteCount;
