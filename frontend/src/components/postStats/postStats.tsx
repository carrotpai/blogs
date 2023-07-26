import React from 'react';

import VoteCount from '../voteCount/voteCount';
import CommentCount from '../commentCount/commentCount';

import styles from './postStats.module.scss';

interface PostStatsProps {
	upvoteFn: () => void;
	downvoteFn: () => void;
	rating: number;
	commentCount: number;
	//status - статус голоса пользователя за пост
	//(меньше 0 - downvote, больше - upvote, =0 - не голосовал)
	status?: number;
}

function PostStats({
	status,
	rating,
	commentCount,
	upvoteFn,
	downvoteFn,
}: PostStatsProps) {
	return (
		<div className={styles.content}>
			<VoteCount
				rating={rating}
				downvoteFn={downvoteFn}
				upvoteFn={upvoteFn}
				status={status}
			/>
			<CommentCount count={commentCount} />
		</div>
	);
}

export default PostStats;
