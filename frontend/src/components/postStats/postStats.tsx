import React from "react";

import VoteCount from "../voteCount/voteCount";
import CommentCount from "../commentCount/commentCount";

import styles from "./postStats.module.scss";

interface PostStatsProps {
	rating: number;
	commentCount: number;
}

function PostStats({ rating, commentCount }: PostStatsProps) {
	return (
		<div className={styles.content}>
			<VoteCount rating={rating} />
			<CommentCount count={commentCount} />
		</div>
	);
}

export default PostStats;
