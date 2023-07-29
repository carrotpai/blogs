import React, { useState } from 'react';

import UserBar from '../userBar/userBar';
import VoteCount from '../voteCount/voteCount';
import Comments from '../comments/comments';

import commentIcon from '../../assets/comment.svg';
import editIcon from '../../assets/edit.svg';
import styles from './comment.module.scss';
import CreateCommentForm from '../createCommentForm/createCommentForm';
import { useQuery } from '@tanstack/react-query';
import { axios } from '../../api/axios';
import { CommentData } from '../../types/types';

interface Comment {
	id: number;
	postId: number;
	parentCommentId?: number;
	currentPage?: number;
	user: {
		id: number;
		avatar?: string;
		username: string;
	};
	createdAt: string;
	text: string;
	rating: number;
	isFirst?: boolean;
	isNested?: boolean;
	isLastCommentInPage?: boolean;
	isPaginationEnded?: boolean;
}

function Comment({
	id,
	parentCommentId,
	postId,
	user,
	text,
	rating,
	createdAt,
	isFirst,
	isNested,
	isLastCommentInPage,
	isPaginationEnded,
}: Comment) {
	const [isFormOpen, setIsFormOpen] = useState(false);
	const { data: repliesCount, isLoading } = useQuery({
		queryFn: async () => {
			return (await axios.get(`comments/count/forcomment/${id}`)).data;
		},
		queryKey: ['repliesCount', id],
		staleTime: 60 * 1000,
	});

	const authorStyles = () => {
		let style: string = styles.comment__author;
		if (isNested) {
			style = style.concat(
				` ${isNested && styles.comment__author_nested}`
			);
			if (isFirst) {
				style = style.concat(` ${styles.comment__author_first}`);
			}
		}
		return style;
	};

	const commentContentStyles = () => {
		let style: string = styles.comment__content;
		if (isLastCommentInPage) {
			style = style.concat(` ${styles.comment__content_lastIngPage}`);
		}
		if (isPaginationEnded && isLastCommentInPage && repliesCount === 0) {
			style = style.concat(` ${styles.comment__content_pagEnd}`);
		}
		if (repliesCount === 0) {
			style = style.concat(` ${styles.comment__content_noReplies}`);
		}
		return style;
	};

	const commentQueryFn = async (page?: number) => {
		return (
			await axios.get<[CommentData[], number]>(
				`comments/forcomment/${id}`
			)
		).data;
	};

	return (
		<div className={`${styles.comment}`}>
			<div className={authorStyles()}>
				<UserBar
					id={user.id}
					avatar={user.avatar}
					username={user.username}
					time={createdAt}
					type="comment"
				/>
			</div>
			<div className={commentContentStyles()}>
				<div className={styles.comment__contentWrapper}>
					<p className={styles.comment__text}>{text}</p>
					<div className={styles.interact}>
						<div className="vote">
							<VoteCount />
						</div>
						<div className={styles.reply}>
							<button
								className={styles.button}
								type="button"
								onClick={() => setIsFormOpen(true)}
							>
								<img src={commentIcon} alt="comment icon" />
								<span className={styles.button__text}>
									reply
								</span>
							</button>
						</div>
						<div className="edit">
							<button type="button" className={styles.button}>
								<img src={editIcon} alt="edit icon" />
								<span className={styles.button__text}>
									edit
								</span>
							</button>
						</div>
					</div>
					<div className="form">
						{isFormOpen && (
							<CreateCommentForm
								parentCommentId={id}
								postId={postId}
								type="reply"
								onClose={() => setIsFormOpen(false)}
							/>
						)}
					</div>
					<div className={styles.comment__children}>
						<Comments
							getComments={commentQueryFn}
							parentCommentId={id}
							postId={postId}
							isNested={true}
							key={`comments-${id}-rep-${repliesCount}`}
							totalComments={repliesCount}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Comment;
