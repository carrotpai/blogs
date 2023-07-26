import React, { useRef } from 'react';
import UserBar from '../userBar/userBar';
import VoteCount from '../voteCount/voteCount';

import styles from './comment.module.scss';
import Comments from '../comments/comments';

interface Comment {
	id: number;
	user: {
		id: number;
		avatar?: string;
		username: string;
	};
	createdAt: string;
	text: string;
	rating: number;
	isNested?: boolean;
	isLastCommentInPage?: boolean;
	isPaginationEnded?: boolean;
}

function Comment({
	user,
	text,
	rating,
	createdAt,
	id,
	isNested,
	isLastCommentInPage,
	isPaginationEnded,
}: Comment) {
	return (
		<div className={styles.comment}>
			<div
				className={`${styles.comment__author} ${
					isNested && styles.comment__author_nested
				}`}
			>
				<UserBar
					id={user.id}
					avatar={user.avatar}
					username={user.username}
					time={createdAt}
					type="comment"
				/>
			</div>
			<div
				className={`${styles.comment__content} ${
					isLastCommentInPage &&
					!isPaginationEnded &&
					styles.comment__content_lastIngPage
				} ${
					isPaginationEnded &&
					isLastCommentInPage &&
					styles.comment__content_pagEnd
				}`}
			>
				<div className={styles.comment__contentWrapper}>
					<p className={styles.comment__text}>{text}</p>
					<div className="interact">
						<div className="vote">votes here</div>
						<div className="reply">Reply</div>
						<div className="edit">Edit</div>
					</div>
					<div className={styles.comment__children}>
						<Comments isNested={true} key={`comment${id}`} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default Comment;
