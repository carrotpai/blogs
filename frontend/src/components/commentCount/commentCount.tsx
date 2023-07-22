import React from "react";

import commmentIcon from "../../assets/comment.svg";

import styles from "./commentCount.module.scss";

interface CommentCountProps {
	count: number;
}

function CommentCount({ count }: CommentCountProps) {
	return (
		<div className={styles.content}>
			<img src={commmentIcon} alt='comment icon' />
			<span className={styles.text}>{count}</span>
		</div>
	);
}

export default CommentCount;
